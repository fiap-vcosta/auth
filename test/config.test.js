const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadConfig, REQUIRED } = require("../src/config");

describe("loadConfig", () => {
  it("retorna config quando todas as variáveis obrigatórias estão definidas", () => {
    const config = loadConfig({
      API_BASE_URL: "http://localhost:8080/",
      JWT_CLIENTE_KEY: "local-jwt-cliente-key-change-me-32chars-min",
      JWT_CLIENTE_ISSUER: "tech-challenge-cliente",
      JWT_CLIENTE_AUDIENCE: "tech-challenge-cliente",
      SERVICE_AUTH_KEY: "local-service-auth-key-change-me",
    });

    assert.equal(config.apiBaseUrl, "http://localhost:8080");
    assert.equal(config.jwtClienteIssuer, "tech-challenge-cliente");
    assert.equal(config.serviceAuthKey, "local-service-auth-key-change-me");
  });

  it("lança erro listando as chaves ausentes", () => {
    assert.throws(
      () => loadConfig({}),
      (err) => {
        assert.match(err.message, /Variáveis de ambiente obrigatórias ausentes/);
        for (const key of REQUIRED) {
          assert.match(err.message, new RegExp(key));
        }
        return true;
      },
    );
  });
});
