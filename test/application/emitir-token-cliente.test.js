const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { emitirTokenCliente } = require("@application/emitir-token-cliente.js");

const config = {
  apiBaseUrl: "http://localhost:8080",
  serviceAuthKey: "k",
  jwtClienteKey: "local-jwt-cliente-key-change-me-32chars-min",
  jwtClienteIssuer: "tech-challenge-cliente",
  jwtClienteAudience: "tech-challenge-cliente",
};

describe("emitirTokenCliente", () => {
  it("retorna validation quando documento é inválido", async () => {
    const result = await emitirTokenCliente(
      { documento: "111" },
      {
        config,
        consultarClientePorDocumento: async () => {
          throw new Error("não deveria chamar");
        },
        emitirJwtCliente: () => "x",
      },
    );

    assert.deepEqual(result, {
      ok: false,
      kind: "validation",
      errors: ["Documento inválido."],
    });
  });

  it("retorna not_found quando a API responde 404", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 404 }),
        emitirJwtCliente: () => "x",
      },
    );

    assert.deepEqual(result, { ok: false, kind: "not_found" });
  });

  it("retorna token quando a API confirma o documento", async () => {
    const result = await emitirTokenCliente(
      { documento: "925.613.243-54" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 200 }),
        emitirJwtCliente: (_cfg, documento) => `jwt-${documento}`,
      },
    );

    assert.deepEqual(result, { ok: true, token: "jwt-92561324354" });
  });

  it("retorna bad_gateway quando a API rejeita a chave", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 401 }),
        emitirJwtCliente: () => "x",
      },
    );

    assert.equal(result.ok, false);
    assert.equal(result.kind, "bad_gateway");
  });

  it("retorna validation quando a API responde 400", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 400 }),
        emitirJwtCliente: () => "x",
      },
    );

    assert.deepEqual(result, {
      ok: false,
      kind: "validation",
      errors: ["Documento inválido."],
    });
  });

  it("retorna bad_gateway quando a API responde status inesperado", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 503 }),
        emitirJwtCliente: () => "x",
      },
    );

    assert.equal(result.ok, false);
    assert.equal(result.kind, "bad_gateway");
  });

  it("retorna bad_gateway quando a consulta falha", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => {
          throw new Error("rede");
        },
        emitirJwtCliente: () => "x",
      },
    );

    assert.equal(result.ok, false);
    assert.equal(result.kind, "bad_gateway");
  });

  it("retorna internal quando a emissão do JWT falha", async () => {
    const result = await emitirTokenCliente(
      { documento: "92561324354" },
      {
        config,
        consultarClientePorDocumento: async () => ({ status: 200 }),
        emitirJwtCliente: () => {
          throw new Error("assinatura");
        },
      },
    );

    assert.equal(result.ok, false);
    assert.equal(result.kind, "internal");
  });
});
