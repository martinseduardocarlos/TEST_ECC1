import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Baloes from "./Baloes";
import Login from "./Login";

function App() {
  // 🔐 Verifica login
  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  // -------------------
  // Estados
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

  const [busca, setBusca] = useState("");
  const [casaisFiltrados, setCasaisFiltrados] = useState([]);

  // -------------------
  // API
  // -------------------

  const loadCasais = async () => {
    const res = await axios.get("http://localhost:8000/casais");
    setCasais(res.data);
  };

  const loadAniversariantes = async () => {
    const res = await axios.get("http://localhost:8000/aniversariantes");
    setAniversariantes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setSucesso("Casal cadastrado com sucesso!");

    loadCasais();

    setTimeout(() => setSucesso(""), 3000);
  };

  useEffect(() => {
    loadCasais();
  }, []);

  useEffect(() => {
    setCasaisFiltrados(casais);
  }, [casais]);

  const filtrarCasais = () => {
    const filtro = busca.toLowerCase();

    const resultado = casais.filter(
      (c) =>
        c.nome_esposo.toLowerCase().includes(filtro) ||
        c.nome_esposa.toLowerCase().includes(filtro) ||
        c.id.toString() === filtro,
    );

    setCasaisFiltrados(resultado);
  };

  const labels = {
    nome_esposo: "NOME ESPOSO",
    nome_esposa: "NOME ESPOSA",
    celular_esposo: "CELULAR ESPOSO",
    celular_esposa: "CELULAR ESPOSA",
    aniversario_esposo: "ANIVERSÁRIO ESPOSO",
    aniversario_esposa: "ANIVERSÁRIO ESPOSA",
    endereco: "ENDEREÇO",
    bairro: "BAIRRO",
    funcao_no_ecc: "FUNÇÃO NO ECC",
  };

  // -------------------
  // Atualizar casal
  // -------------------

  function AtualizaCasal({ casalId, voltar }) {
    const [formAtualiza, setFormAtualiza] = useState({});

    useEffect(() => {
      axios.get("http://localhost:8000/casais").then((res) => {
        const casal = res.data.find((c) => c.id === casalId);
        if (casal) setFormAtualiza(casal);
      });
    }, [casalId]);

    const handleChange = (e) => {
      setFormAtualiza({
        ...formAtualiza,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      await axios.put(`http://localhost:8000/casais/${casalId}`, formAtualiza);

      alert("Casal atualizado!");

      voltar();

      loadCasais();
    };

    return (
      <div>
        <h2>Atualizar Casal</h2>

        <form onSubmit={handleSubmit}>
          {Object.keys(formAtualiza).map((field) => (
            <div key={field}>
              <label>{labels[field] || field}</label>

              <input
                type={field.includes("aniversario") ? "date" : "text"}
                name={field}
                value={formAtualiza[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <button type="submit">Atualizar</button>

          <button onClick={voltar}>Voltar</button>
        </form>
      </div>
    );
  }

  // -------------------
  // RENDER
  // -------------------

  return (
    <div className="container">
      <h1>CADASTRO DE CASAIS</h1>

      <div className="button-container">
        {telaAtual.tela === "menu" ? (
          <>
            <button onClick={() => setTelaAtual({ tela: "cadastro" })}>
              CADASTRAR CASAL
            </button>

            <button onClick={() => setTelaAtual({ tela: "lista" })}>
              BUSCAR CASAL
            </button>

            <button
              onClick={() => {
                setTelaAtual({ tela: "aniversariantes" });
                loadAniversariantes();
              }}
            >
              ANIVERSÁRIO DO DIA
            </button>

            <button onClick={() => setTelaAtual({ tela: "relatorios" })}>
              EXCLUIR
            </button>
          </>
        ) : (
          <button onClick={() => setTelaAtual({ tela: "menu" })}>VOLTAR</button>
        )}
      </div>

      {/* CADASTRO */}

      {telaAtual.tela === "cadastro" && (
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label>{labels[field]}</label>

              <input
                type={field.includes("aniversario") ? "date" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}

          <button type="submit">SALVAR CASAL</button>

          {sucesso && <p>{sucesso}</p>}
        </form>
      )}

      {/* LISTA */}

      {telaAtual.tela === "lista" && (
        <>
          <h2>CASAIS CADASTRADOS</h2>

          <input
            placeholder="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button onClick={filtrarCasais}>Buscar</button>

          <ul>
            {casaisFiltrados.map((c) => (
              <li key={c.id}>
                <p>
                  {c.nome_esposo} e {c.nome_esposa}
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

      {/* ATUALIZAR */}

      {telaAtual.tela === "atualiza" && (
        <AtualizaCasal
          casalId={telaAtual.id}
          voltar={() => setTelaAtual({ tela: "lista" })}
        />
      )}

      {/* ANIVERSARIANTES */}

      {telaAtual.tela === "aniversariantes" && (
        <div>
          <h2>PARABÉNS</h2>

          <Baloes />

          {aniversariantes.map((p) => (
            <div key={p.id}>
              <p>{p.nome}</p>

              <button
                onClick={() =>
                  window.open(`https://wa.me/${p.celular}`, "_blank")
                }
              >
                WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
