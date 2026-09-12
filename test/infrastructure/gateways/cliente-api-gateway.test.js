const { describe, it, mock } = require("node:test");
const assert = require("node:assert/strict");
const {
  consultarClientePorDocumento,
} = require("@infrastructure/gateways/cliente-api-gateway.js");

describe("consultarClientePorDocumento", () => {
  it("chama a API com X-Service-Key e documento na URL", async () => {
    const fetchFn = mock.fn(async () => ({ status: 200 }));

    const result = await consultarClientePorDocumento(
      {
        apiBaseUrl: "http://localhost:8080",
        serviceAuthKey: "local-service-auth-key-change-me",
      },
      "92561324354",
      { fetchFn },
    );

    assert.equal(result.status, 200);
    assert.equal(fetchFn.mock.callCount(), 1);
    const [url, options] = fetchFn.mock.calls[0].arguments;
    assert.equal(url, "http://localhost:8080/api/system/clientes/por-documento/92561324354");
    assert.equal(options.method, "GET");
    assert.equal(options.headers["X-Service-Key"], "local-service-auth-key-change-me");
  });
});
