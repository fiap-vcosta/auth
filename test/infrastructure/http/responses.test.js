const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  sendValidationErrors,
  sendProblemDetails,
} = require("@infrastructure/http/responses.js");

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
  };
}

describe("responses", () => {
  it("envia errors de validação no formato da API", () => {
    const res = mockRes();
    sendValidationErrors(res, ["Documento inválido."]);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { errors: ["Documento inválido."] });
  });

  it("envia Problem Details para 404", () => {
    const res = mockRes();
    sendProblemDetails(res, 404);
    assert.equal(res.statusCode, 404);
    assert.equal(res.contentType, "application/problem+json");
    assert.equal(res.body.type, "about:blank");
    assert.equal(res.body.title, "Not Found");
    assert.equal(res.body.status, 404);
    assert.equal(typeof res.body.traceId, "string");
  });
});
