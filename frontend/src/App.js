import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Baloes from "./Baloes";

// ... seu código igualzinho

function App() {
  // -------------------
  // 1️⃣ Estados do App
  // -------------------
  const [casais, setCasais] = useState([]);
  const [telaAtual, setTelaAtual] = useState({ tela: "menu", id: null });
  const [form, setForm] = useState({
    nome_esposo: "",
    nome_esposa: "",
    celular_esposo: "",
    celular_esposa: "",
    aniversario_esposo: "",
    aniversario_esposa: "",
    endereco: "",
    bairro: "",
    funcao_no_ecc: "",
  });
  const [sucesso, setSucesso] = useState("");
  const [aniversariantes, setAniversariantes] = useState([]);

  // Novos estados para busca
  const [busca, setBusca] = useState("");
  const [casaisFiltrados, setCasaisFiltrados] = useState([]);

  // -------------------
  // 2️⃣ Funções de API
  // -------------------
  const loadCasais = async () => {
    try {
      const res = await axios.get("http://localhost:8000/casais");
      setCasais(res.data);
    } catch (error) {
      console.error("Erro ao carregar casais:", error);
    }
  };

  const loadAniversariantes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/aniversariantes");
      setAniversariantes(res.data);
    } catch (error) {
      console.error("Erro ao carregar aniversariantes:", error);
      setAniversariantes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/casais", form);
      setForm({
        nome_esposo: "",
        nome_esposa: "",
        celular_esposo: "",
        celular_esposa: "",
        aniversario_esposo: "",
        aniversario_esposa: "",
        endereco: "",
        bairro: "",
        funcao_no_ecc: "",
      });
      loadCasais();
      setSucesso("✅ Casal cadastrado com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSucesso("⚠️ Este casal já está cadastrado!");
        setForm({
          nome_esposo: "",
          nome_esposa: "",
          celular_esposo: "",
          celular_esposa: "",
          aniversario_esposo: "",
          aniversario_esposa: "",
          endereco: "",
          bairro: "",
          funcao_no_ecc: "",
        });
      } else {
        setSucesso("❌ Erro ao cadastrar casal. Tente novamente.");
      }
      setTimeout(() => setSucesso(""), 4000);
    }
  };

  useEffect(() => {
    loadCasais();
  }, []);

  useEffect(() => {
    // Atualiza a lista filtrada sempre que os casais mudam
    setCasaisFiltrados(casais);
  }, [casais]);

  const filtrarCasais = () => {
    const filtro = busca.toLowerCase();
    const resultado = casais.filter(
      (c) =>
        c.nome_esposo.toLowerCase().includes(filtro) ||
        c.nome_esposa.toLowerCase().includes(filtro) ||
        c.id.toString() === filtro
    );
    setCasaisFiltrados(resultado);
  };

  const labels = {
    nome_esposo: "NOME ESPOSO",
    nome_esposa: "NOME ESPOSA",
    celular_esposo: "CELULAR ESPOSO",
    celular_esposa: "CELULAR ESPOSA",
    aniversario_esposo: "ANIVERSÁRIO ESPOSO ",
    aniversario_esposa: "ANIVERSÁRIO ESPOSA ",
    endereco: "ENDEREÇO",
    bairro: "BAIRRO",
    funcao_no_ecc: "FUNÇÃO NO ECC",
  };

  // -------------------
  // 3️⃣ Componente de Atualização
  // -------------------
  function AtualizaCasal({ casalId, voltar }) {
    const [formAtualiza, setFormAtualiza] = useState({
      nome_esposo: "",
      nome_esposa: "",
      celular_esposo: "",
      celular_esposa: "",
      aniversario_esposo: "",
      aniversario_esposa: "",
      endereco: "",
      bairro: "",
      funcao_no_ecc: "",
    });

    useEffect(() => {
      axios
        .get(`http://localhost:8000/casais`)
        .then((res) => {
          const casal = res.data.find((c) => c.id === casalId);
          if (casal) setFormAtualiza(casal);
        })
        .catch((err) => console.log(err));
    }, [casalId]);

    const handleChange = (e) => {
      setFormAtualiza({ ...formAtualiza, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .put(`http://localhost:8000/casais/${casalId}`, formAtualiza)
        .then(() => {
          alert("Casal atualizado com sucesso!");
          voltar();
          loadCasais();
        })
        .catch((err) => console.log(err));
    };

    return (
      <div>
        <h2>Atualizar Casal</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formAtualiza).map((field) => (
            <div key={field}>
              <label>{labels[field] || field}:</label>
              <input
                type={field.includes("aniversario") ? "date" : "text"}
                name={field}
                value={formAtualiza[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Atualizar</button>
          <button type="button" onClick={voltar}>
            Voltar
          </button>
        </form>
      </div>
    );
  }

  // -------------------
  // 4️⃣ Render
  // -------------------

  return (
    <div className="container">
      <h1>CADASTRO DE CASAIS</h1>

      {/* Menu */}
      <div className="button-container">
        {telaAtual.tela === "menu" ? (
          <>
            <button
              onClick={() => setTelaAtual({ tela: "cadastro", id: null })}
            >
              CADASTRAR CASAL
            </button>
            <button onClick={() => setTelaAtual({ tela: "lista", id: null })}>
              BUSCAR CASAL
            </button>
            <button
              onClick={() => {
                setTelaAtual({ tela: "aniversariantes", id: null });
                loadAniversariantes();
              }}
            >
              ANIVERSÁRIO DO DIA
            </button>
            <button
              onClick={() => setTelaAtual({ tela: "relatorios", id: null })}
            >
              EXCLUIR
            </button>
          </>
        ) : (
          <button onClick={() => setTelaAtual({ tela: "menu", id: null })}>
            ⬅ VOLTAR
          </button>
        )}
      </div>

      {/* Cadastro */}
      {telaAtual.tela === "cadastro" && (
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label>{labels[field]}:</label>
              <input
                type={field.includes("aniversario") ? "date" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}
          <button type="submit">SALVAR CASAL</button>
          {sucesso && <p className="msg-sucesso">{sucesso}</p>}
        </form>
      )}

      {/* Lista / Busca de Casais */}
      {telaAtual.tela === "lista" && (
        <>
          <h2>CASAIS CADASTRADOS</h2>

          {/* Campo de busca */}
          <input
            type="text"
            placeholder="Buscar por nome ou ID"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button
            onClick={filtrarCasais}
            style={{ padding: "5px 10px", marginRight: "5px" }}
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setBusca("");
              loadCasais();
            }}
            style={{ padding: "5px 10px" }}
          >
            Listar Todos os Casais
          </button>

          <ul style={{ marginTop: "10px" }}>
            {casaisFiltrados.map((c) => (
              <li key={c.id} className="casal-card">
                <p>
                  <strong>ID:</strong> {c.id} | <strong>Esposo:</strong>{" "}
                  {c.nome_esposo} | <strong>Celular:</strong> {c.celular_esposo}
                </p>
                <p>
                  <strong>Esposa:</strong> {c.nome_esposa} |{" "}
                  <strong>Celular:</strong> {c.celular_esposa}
                </p>
                <p>
                  <strong>Endereço:</strong> {c.endereco} |{" "}
                  <strong>Bairro:</strong> {c.bairro}
                </p>
                <p>
                  <strong>Função no ECC:</strong> {c.funcao_no_ecc}
                </p>
                <button
                  onClick={() => setTelaAtual({ tela: "atualiza", id: c.id })}
                >
                  Atualizar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Atualizar */}
      {telaAtual.tela === "atualiza" && telaAtual.id && (
        <AtualizaCasal
          casalId={telaAtual.id}
          voltar={() => setTelaAtual({ tela: "lista", id: null })}
        />
      )}

      {/* Aniversariantes */}
      {telaAtual.tela === "aniversariantes" && (
        <div className="aniversariantes-container">
          <h2 className="titulo-aniversario">🎉 PARABÉNS! 🎂</h2>

          {aniversariantes.length > 0 ? (
            <>
              <Baloes /> {/* 🎈🎈 balões animados 🎈🎈 */}
              {aniversariantes.map((pessoa) => (
                <div key={pessoa.id} className="aniversariante-card">
                  <p>
                    <strong>{pessoa.nome}</strong> faz aniversário hoje!
                  </p>
                  <p className="versiculo">
                    📖 "O amor é paciente, o amor é bondoso..." <br /> (1
                    Coríntios 13:4)
                  </p>
                  <button
                    className="btn-whatsapp-round"
                    onClick={() => {
                      const numero = pessoa.celular;
                      const mensagem =
                        " A FAMÍLIA ECC DESEJA UM FELIZ ANIVERSÁRIO  E VIVA NOSSA BELA UNIÃO!";

                      if (!numero) {
                        alert("Número de celular não cadastrado!");
                        return;
                      }

                      window.open(
                        `https://wa.me/${numero}?text=${encodeURIComponent(
                          mensagem
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    WhatsApp
                  </button>
                </div>
              ))}
            </>
          ) : (
            <p>Hoje não há aniversariantes.</p>
          )}
        </div>
      )}

      {/* Exclusão */}
      {telaAtual.tela === "relatorios" && (
        <>
          <h2>EXCLUIR CASAL</h2>
          <ul>
            {casais.map((c) => (
              <li key={c.id} className="casal-card">
                <p>
                  <strong>{c.nome_esposo}</strong> e{" "}
                  <strong>{c.nome_esposa}</strong>
                </p>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        `Deseja realmente excluir o casal ${c.nome_esposo} e ${c.nome_esposa}?`
                      )
                    ) {
                      await axios.delete(
                        `http://localhost:8000/casais/${c.id}`
                      );
                      loadCasais();
                      alert("Casal excluído com sucesso!");
                    }
                  }}
                  className="btn-excluir"
                >
                  EXCLUIR
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
