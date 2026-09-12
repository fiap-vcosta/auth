const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { applyEnvFile } = require("@test/helpers/load-env.js");
const { createHandleAuth } = require("@presentation/auth-handler.js");
const { loadConfig } = require("@infrastructure/config.js");

applyEnvFile();

function mockRes() {
  return {
    statusCode: null,
    body: null,
    contentType: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    type(value) {
      this.contentType = value;
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

  it("rejeita método diferente de POST com Problem Details 405", async () => {
    const handleAuth = createHandleAuth();
    const res = mockRes();
    await handleAuth({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.type, "about:blank");
    assert.equal(res.body.title, "Method Not Allowed");
  });

  it("rejeita documento inválido com errors", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => {
        throw new Error("não deveria chamar a API");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { documento: "111" } }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { errors: ["Documento inválido."] });
  });

  it("retorna 404 Problem Details quando a API responde 404", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 404 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { documento: "92561324354" } }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.type, "about:blank");
    assert.equal(res.body.title, "Not Found");
    assert.equal(res.body.status, 404);
  });

  it("não aceita alias cpf no body", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 200 }),
      emitirJwtFn: () => "token",
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "92561324354" } }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { errors: ["Documento inválido."] });
  });

  it("retorna 502 Problem Details quando a API rejeita a chave", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 401 }),
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { documento: "92561324354" } }, res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.type, "about:blank");
    assert.equal(res.body.title, "Bad Gateway");
  });

  it("retorna 500 Problem Details quando a config está inválida", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => {
        throw new Error("Variáveis de ambiente obrigatórias ausentes: API_BASE_URL");
      },
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { documento: "92561324354" } }, res);
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.title, "Internal Server Error");
  });

  it("emite JWT quando a API confirma o documento", async () => {
    const handleAuth = createHandleAuth({
      loadConfigFn: () => loadConfig(),
      consultarClienteFn: async () => ({ status: 200 }),
      emitirJwtFn: () => "token.jwt.de.teste",
    });
    const res = mockRes();
    await handleAuth({ method: "POST", body: { documento: "925.613.243-54" } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { token: "token.jwt.de.teste" });
  });
});
