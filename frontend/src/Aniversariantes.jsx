import React, { useEffect, useState } from "react";
import axios from "axios";

function Aniversariantes() {
  const [aniversariantes, setAniversariantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:8000/aniversariantes");
        setAniversariantes(res.data);
      } catch (error) {
        console.error("Erro ao buscar aniversariantes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>⏳ Carregando aniversariantes...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎉 Parabéns! 🎂</h2>
      {aniversariantes.length > 0 ? (
        <ul style={styles.list}>
          {aniversariantes.map((pessoa) => (
            <li key={pessoa.id} style={styles.item}>
              🎉 <strong>{pessoa.nome}</strong> faz aniversário hoje (
              {pessoa.aniversario})!
              <p>
                📖 "O amor é paciente, o amor é bondoso..." (1 Coríntios 13:4)
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Hoje não há aniversariantes.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "20px auto",
    textAlign: "center",
  },
  title: {
    marginBottom: "15px",
    color: "#444",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

export default Aniversariantes;
