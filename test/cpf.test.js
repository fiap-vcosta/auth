const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeCpf, isValidCpf } = require("../src/cpf");

describe("cpf", () => {
  it("normaliza removendo pontuação", () => {
    assert.equal(normalizeCpf("925.613.243-54"), "92561324354");
  });

  it("aceita CPF de teste local (11 dígitos)", () => {
    assert.equal(isValidCpf("92561324354"), true);
  });

  it("rejeita CPF com dígitos repetidos", () => {
    assert.equal(isValidCpf("00000000000"), false);
  });

  it("rejeita CPF com tamanho inválido", () => {
    assert.equal(isValidCpf("123"), false);
  });
});
