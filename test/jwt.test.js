const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { applyEnvFile } = require("./load-env");
const { loadConfig } = require("../src/config");
const { emitirJwtCliente } = require("../src/jwt");

applyEnvFile("../.env.test");

describe("emitirJwtCliente", () => {
  it("emite JWT HS256 com claim cpf, iss e aud alinhados à API", () => {
    const config = loadConfig();
    const token = emitirJwtCliente(config, "92561324354");
    const payload = jwt.verify(token, config.jwtClienteKey, {
      algorithms: ["HS256"],
      issuer: config.jwtClienteIssuer,
      audience: config.jwtClienteAudience,
    });

    assert.equal(payload.cpf, "92561324354");
    assert.equal(payload.iss, "tech-challenge-cliente");
    assert.equal(payload.aud, "tech-challenge-cliente");
  });
});
