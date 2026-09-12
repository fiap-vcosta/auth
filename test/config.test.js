const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { applyEnvFile } = require("./load-env");
const { loadConfig, REQUIRED } = require("../src/config");

applyEnvFile("../.env.test");

describe("loadConfig", () => {
  it("retorna config a partir do .env.test", () => {
    const config = loadConfig();

    assert.equal(config.apiBaseUrl, "http://localhost:8080");
    assert.equal(config.jwtClienteKey, "local-jwt-cliente-key-change-me-32chars-min");
    assert.equal(config.jwtClienteIssuer, "tech-challenge-cliente");
    assert.equal(config.jwtClienteAudience, "tech-challenge-cliente");
    assert.equal(config.serviceAuthKey, "local-service-auth-key-change-me");
    assert.equal(config.jwtExpiresInSeconds, 1800);
  });

  it("remove barra final de API_BASE_URL", () => {
    const config = loadConfig({
      ...Object.fromEntries(REQUIRED.map((key) => [key, process.env[key]])),
      API_BASE_URL: `${process.env.API_BASE_URL}/`,
    });

    assert.equal(config.apiBaseUrl, "http://localhost:8080");
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
