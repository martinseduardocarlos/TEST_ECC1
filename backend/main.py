from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, SQLModel, Session, create_engine, select
from typing import Optional, List
from datetime import datetime
from sqlmodel import Session
from sqlmodel import SQLModel, Field
from fastapi import Body

class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    senha: str
    
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criar_hash(senha: str):
    return pwd_context.hash(senha)

def verificar_senha(senha, hash):
    return pwd_context.verify(senha, hash)

# ----------------------------
# Modelo do Banco
# ----------------------------
class Casal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome_esposo: str
    nome_esposa: str
    celular_esposo: Optional[str] = None
    celular_esposa: Optional[str] = None
    aniversario_esposo: Optional[str] = None  # formato YYYY-MM-DD
    aniversario_esposa: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    funcao_no_ecc: Optional[str] = None


from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel

# Modelo para atualização parcial
class CasalUpdate(SQLModel):
    nome_esposo: Optional[str] = None
    nome_esposa: Optional[str] = None
    celular_esposo: Optional[str] = None
    celular_esposa: Optional[str] = None
    aniversario_esposo: Optional[str] = None
    aniversario_esposa: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    funcao_no_ecc: Optional[str] = None

# ----------------------------
# Configuração do App
# ----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sqlite_file_name = "casais.db"
engine = create_engine(f"sqlite:///{sqlite_file_name}", echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ----------------------------
# Endpoints
# ----------------------------

# Listar casais
@app.get("/casais", response_model=List[Casal])
def listar_casais():
    with Session(engine) as session:
        return session.exec(select(Casal)).all()
    
# material novo 13.032026
@app.post("/login")
def login(dados: dict = Body(...)):

    username = dados.get("username")
    password = dados.get("password")

    with Session(engine) as session:

        usuario = session.exec(
            select(Usuario).where(Usuario.username == username)
        ).first()

        if not usuario:
            return {"erro": "Usuário não encontrado"}

        if not verificar_senha(password, usuario.senha):
            return {"erro": "Senha incorreta"}

        return {"token": "logado"}

# Criar casal com verificação de duplicidade
@app.post("/casais", response_model=Casal)
def criar_casal(casal: Casal):
    with Session(engine) as session:
        # Verifica se já existe um casal com mesmo esposo ou mesma esposa
        query = select(Casal).where(
            (Casal.nome_esposo == casal.nome_esposo) |
            (Casal.nome_esposa == casal.nome_esposa)
        )
        existente = session.exec(query).first()
        if existente:
            raise HTTPException(
                status_code=400,
                detail="⚠️ Já existe um cadastro com esse esposo ou essa esposa!"
            )

        session.add(casal)
        session.commit()
        session.refresh(casal)
        return casal


# Atualizar casal com verificação de duplicidade
@app.put("/casais/{casal_id}", response_model=Casal)
def atualizar_casal(casal_id: int, casal: CasalUpdate):
    with Session(engine) as session:
        db_casal = session.get(Casal, casal_id)
        if not db_casal:
            raise HTTPException(status_code=404, detail="Casal não encontrado")

        # Verifica se ao atualizar vai colidir com outro casal existente
        query = select(Casal).where(
            ((Casal.nome_esposo == casal.nome_esposo) & (Casal.id != casal_id)) |
            ((Casal.nome_esposa == casal.nome_esposa) & (Casal.id != casal_id))
        )
        existente = session.exec(query).first()
        if existente:
            raise HTTPException(
                status_code=400,
                detail="⚠️ Já existe outro cadastro com esse esposo ou essa esposa!"
            )

        # Atualiza apenas campos preenchidos
        for field, value in casal.dict(exclude_unset=True).items():
            setattr(db_casal, field, value)

        session.add(db_casal)
        session.commit()
        session.refresh(db_casal)
        return db_casal


# Deletar casal
@app.delete("/casais/{casal_id}")
def deletar_casal(casal_id: int):
    with Session(engine) as session:
        db_casal = session.get(Casal, casal_id)
        if not db_casal:
            raise HTTPException(status_code=404, detail="Casal não encontrado")

        session.delete(db_casal)
        session.commit()
        return {"ok": True}

# ----------------------------
# Buscar aniversariantes
# ----------------------------
# Buscar aniversariantes (com balões 🎈🎉)
# ----------------------------
@app.get("/aniversariantes")
def get_aniversariantes():
    hoje = datetime.now().strftime("%m-%d")
    aniversariantes = []

    with Session(engine) as session:
        casais = session.exec(select(Casal)).all()

        for casal in casais:
            # Verifica se o esposo faz aniversário hoje
            if casal.aniversario_esposo and casal.aniversario_esposo[5:] == hoje:
                aniversariantes.append({
                    "id": f"{casal.id}-marido",
                    "nome": f" {casal.nome_esposo} ",
                    "celular": casal.celular_esposo
                })
            # Verifica se a esposa faz aniversário hoje
            if casal.aniversario_esposa and casal.aniversario_esposa[5:] == hoje:
                aniversariantes.append({
                    "id": f"{casal.id}-esposa",
                    "nome": f" {casal.nome_esposa} ",
                    "celular": casal.celular_esposa
                })

    return aniversariantes
@app.post("/criar-admin")
def criar_admin():

    with Session(engine) as session:

        usuario = session.exec(
            select(Usuario).where(Usuario.username == "admin")
        ).first()

        if usuario:
            return {"msg": "admin já existe"}

        novo_admin = Usuario(
            username="admin",
            senha=criar_hash("123456")
        )

        session.add(novo_admin)
        session.commit()

        return {"msg": "admin criado com sucesso"}