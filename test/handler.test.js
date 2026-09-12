const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { applyEnvFile } = require("./load-env");
const { createHandleAuth } = require("../src/handler");
const { loadConfig } = require("../src/config");

applyEnvFile("../.env.test");

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("handleAuth", () => {
  it("responde 204 em OPTIONS", async () => {
    const handleAuth = createHandleAuth();
    const res = mockRes();
    await handleAuth({ method: "OPTIONS" }, res);
    assert.equal(res.statusCode, 204);
  });

  it("rejeita método diferente de POST com 405", async () => {
    const handleAuth = createHandleAuth();
    const res = mockRes();
    await handleAuth({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
    assert.deepEqual(res.body, { erro: "Método não permitido" });
  });

  it("retorna 500 quando a config está inválida", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => {
        throw new Error("Variáveis de ambiente obrigatórias ausentes: API_BASE_URL");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, { erro: "Configuração inválida do serviço" });
  });

  it("rejeita CPF inválido com 400", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => {
        throw new Error("não deveria chamar a API");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "111" } }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { erro: "CPF inválido" });
  });

  it("retorna 401 quando a API responde 404", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 404 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { erro: "Não foi possível autenticar o cliente" });
  });

  it("retorna 502 quando a API rejeita a chave de serviço", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 401 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { erro: "Falha na autenticação de serviço com a API" });
  });

  it("retorna 400 quando a API responde 400", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 400 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { erro: "CPF inválido" });
  });

  it("retorna 502 quando a API responde status inesperado", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 503 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { erro: "Resposta inesperada da API" });
  });

  it("retorna 502 quando a consulta à API falha", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => {
        throw new Error("rede indisponível");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { erro: "Falha ao consultar a API" });
  });

  it("retorna 500 quando a emissão do JWT falha", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 200 }),
      emitirJwtFn: () => {
        throw new Error("chave inválida");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, { erro: "Falha ao emitir token" });
  });

  it("emite JWT quando a API confirma o CPF", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 200 }),
      emitirJwtFn: () => "token.jwt.de.teste",
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "433.722.510-34" } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { token: "token.jwt.de.teste" });
  });
});
