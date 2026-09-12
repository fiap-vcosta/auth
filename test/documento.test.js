const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeDocumento, tryNormalizeValidDocumento } = require("../src/documento");

describe("documento", () => {
  it("normaliza removendo pontuação de CPF", () => {
    assert.equal(normalizeDocumento("925.613.243-54"), "92561324354");
  });

  it("normaliza removendo pontuação de CNPJ", () => {
    assert.equal(normalizeDocumento("11.222.333/0001-81"), "11222333000181");
  });

  it("aceita CPF válido", () => {
    assert.equal(tryNormalizeValidDocumento("925.613.243-54"), "92561324354");
  });

  it("aceita CNPJ válido", () => {
    assert.equal(tryNormalizeValidDocumento("11.222.333/0001-81"), "11222333000181");
  });

  it("rejeita documento inválido", () => {
    assert.equal(tryNormalizeValidDocumento("111"), null);
    assert.equal(tryNormalizeValidDocumento("00000000000"), null);
  });
});
