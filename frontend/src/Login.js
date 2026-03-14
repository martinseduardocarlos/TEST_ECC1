import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fazerLogin = async () => {
    const resposta = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await resposta.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      alert("Login realizado com sucesso!");

      window.location.reload();
    } else {
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login Sistema ECC</h2>

      <input
        placeholder="Usuário"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={fazerLogin}>Entrar</button>
    </div>
  );
}

export default Login;
