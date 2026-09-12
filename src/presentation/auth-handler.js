const { loadConfig } = require("../infrastructure/config");
const { consultarClientePorDocumento } = require("../infrastructure/gateways/cliente-api-gateway");
const { emitirJwtCliente } = require("../infrastructure/jwt/jwt-cliente-issuer");
const { emitirTokenCliente } = require("../application/emitir-token-cliente");
const {
  sendValidationErrors,
  sendProblemDetails,
  sendOk,
} = require("../infrastructure/http/responses");

function createHandleAuth({
  loadConfigFn = loadConfig,
  consultarClienteFn = consultarClientePorDocumento,
  emitirJwtFn = emitirJwtCliente,
  emitirTokenFn = emitirTokenCliente,
} = {}) {
  return async function handleAuth(req, res) {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      sendProblemDetails(res, 405, "Method Not Allowed", {
        detail: "Método não permitido",
      });
      return;
    }

    let config;
    try {
      config = loadConfigFn();
    } catch (err) {
      console.error(err.message);
      sendProblemDetails(res, 500, "Internal Server Error", {
        detail: "Configuração inválida do serviço",
      });
      return;
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const result = await emitirTokenFn(
      { documento: body.documento },
      {
        config,
        consultarClientePorDocumento: consultarClienteFn,
        emitirJwtCliente: emitirJwtFn,
      },
    );

    if (result.ok) {
      sendOk(res, { token: result.token });
      return;
    }

    if (result.kind === "validation") {
      sendValidationErrors(res, result.errors);
      return;
    }

    if (result.kind === "not_found") {
      sendProblemDetails(res, 404, "Not Found");
      return;
    }

    if (result.kind === "bad_gateway") {
      if (result.cause) {
        console.error(`Falha ao consultar a API: ${result.cause.message}`);
      } else if (result.statusFromApi) {
        console.error(`Resposta inesperada da API: HTTP ${result.statusFromApi}`);
      } else {
        console.error(result.detail);
      }
      sendProblemDetails(res, 502, result.title ?? "Bad Gateway", {
        detail: result.detail,
      });
      return;
    }

    if (result.cause) {
      console.error(`${result.detail}: ${result.cause.message}`);
    }
    sendProblemDetails(res, 500, result.title ?? "Internal Server Error", {
      detail: result.detail,
    });
  };
}

const handleAuth = createHandleAuth();

module.exports = { handleAuth, createHandleAuth };
