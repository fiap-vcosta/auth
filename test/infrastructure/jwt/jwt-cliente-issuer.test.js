const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { applyEnvFile } = require("@test/helpers/load-env.js");
const { loadConfig } = require("@infrastructure/config.js");
const {
  emitirJwtCliente,
  JWT_EXPIRES_IN_SECONDS,
} = require("@infrastructure/jwt/jwt-cliente-issuer.js");

applyEnvFile();

describe("emitirJwtCliente", () => {
  it("emite JWT HS256 com claim documento, iss e aud alinhados à API", () => {
    const config = loadConfig();
    const token = emitirJwtCliente(config, "92561324354");
    const payload = jwt.verify(token, config.jwtClienteKey, {
      algorithms: ["HS256"],
      issuer: config.jwtClienteIssuer,
      audience: config.jwtClienteAudience,
    });

    assert.equal(payload.documento, "92561324354");
    assert.equal(payload.iss, "tech-challenge-cliente");
    assert.equal(payload.aud, "tech-challenge-cliente");
    assert.equal(payload.exp - payload.iat, JWT_EXPIRES_IN_SECONDS);
  });

  it("emite JWT com CNPJ no claim documento", () => {
    const config = loadConfig();
    const token = emitirJwtCliente(config, "11222333000181");
    const payload = jwt.verify(token, config.jwtClienteKey, {
      algorithms: ["HS256"],
      issuer: config.jwtClienteIssuer,
      audience: config.jwtClienteAudience,
    });

    assert.equal(payload.documento, "11222333000181");
  });
});
