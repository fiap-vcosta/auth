"use strict";

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
  it("rejects non-POST with 405", async () => {
    const res = mockRes();
    await handleAuth({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
    assert.deepEqual(res.body, { error: "method_not_allowed" });
  });

  it("returns 501 until CPF → JWT is implemented", async () => {
    const res = mockRes();
    await handleAuth({ method: "POST", body: { cpf: "43372251034" } }, res);
    assert.equal(res.statusCode, 501);
    assert.deepEqual(res.body, { error: "not_implemented" });
  });
});
