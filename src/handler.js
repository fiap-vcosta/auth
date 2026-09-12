const { loadConfig } = require("./config");
const { normalizeCpf, isValidCpf } = require("./cpf");
const { consultarClientePorDocumento } = require("./api-client");
const { emitirJwtCliente } = require("./jwt");

function createHandleAuth({
  loadConfigFn = loadConfig,
  consultarClienteFn = consultarClientePorDocumento,
  emitirJwtFn = emitirJwtCliente,
} = {}) {
  return async function handleAuth(req, res) {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ erro: "Método não permitido" });
      return;
    }

    let config;
    try {
      config = loadConfigFn();
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ erro: "Configuração inválida do serviço" });
      return;
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const cpf = normalizeCpf(body.cpf);
    if (!isValidCpf(cpf)) {
      res.status(400).json({ erro: "CPF inválido" });
      return;
    }

    let consulta;
    try {
      consulta = await consultarClienteFn(config, cpf);
    } catch (err) {
      console.error(`Falha ao consultar a API: ${err.message}`);
      res.status(502).json({ erro: "Falha ao consultar a API" });
      return;
    }

    if (consulta.status === 404) {
      res.status(401).json({ erro: "Não foi possível autenticar o cliente" });
      return;
    }

    if (consulta.status === 401) {
      console.error("API rejeitou a chave de serviço (X-Service-Key)");
      res.status(502).json({ erro: "Falha na autenticação de serviço com a API" });
      return;
    }

    if (consulta.status === 400) {
      res.status(400).json({ erro: "CPF inválido" });
      return;
    }

    if (consulta.status !== 200) {
      console.error(`Resposta inesperada da API: HTTP ${consulta.status}`);
      res.status(502).json({ erro: "Resposta inesperada da API" });
      return;
    }

    try {
      const token = emitirJwtFn(config, cpf);
      res.status(200).json({ token });
    } catch (err) {
      console.error(`Falha ao emitir JWT: ${err.message}`);
      res.status(500).json({ erro: "Falha ao emitir token" });
    }
  };
}

const handleAuth = createHandleAuth();

module.exports = { handleAuth, createHandleAuth };
