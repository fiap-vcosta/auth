const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { handleAuth } = require("../src/handler");

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
  };
}

describe("handleAuth (scaffold)", () => {
  it("rejeita método diferente de POST com 405", async () => {
    const res = mockRes();
    await handleAuth({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
    assert.deepEqual(res.body, { erro: "Método não permitido" });
  });

  it("retorna 501 até o fluxo CPF → JWT ser implementado", async () => {
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 501);
    assert.deepEqual(res.body, { erro: "Não implementado" });
  });
});
