import React, { useEffect, useState } from "react";
import "./Baloes.css";

export default function Baloes() {
  const [baloes, setBaloes] = useState([]);

  useEffect(() => {
    let novosBaloes = [];
    for (let i = 0; i < 15; i++) {
      novosBaloes.push({
        id: i,
        left: Math.random() * 100, // posição aleatória na tela
        delay: Math.random() * 5, // tempo diferente de animação
      });
    }
    setBaloes(novosBaloes);
  }, []);

  return (
    <div className="baloes-container">
      {baloes.map((b) => (
        <div
          key={b.id}
          className="balao"
          style={{ left: `${b.left}%`, animationDelay: `${b.delay}s` }}
        >
          🎈
        </div>
      ))}
    </div>
  );
}
