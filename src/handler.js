async function handleAuth(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Método não permitido" });
    return;
  }

  res.status(501).json({ erro: "Não implementado" });
}

module.exports = { handleAuth };
