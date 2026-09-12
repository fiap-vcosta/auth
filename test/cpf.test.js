const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeCpf, isValidCpf } = require("../src/cpf");

describe("cpf", () => {
  it("normaliza removendo pontuação", () => {
    assert.equal(normalizeCpf("433.722.510-34"), "43372251034");
  });

  it("aceita CPF do seed (11 dígitos)", () => {
    assert.equal(isValidCpf("43372251034"), true);
  });

  it("rejeita CPF com dígitos repetidos", () => {
    assert.equal(isValidCpf("00000000000"), false);
  });

  it("rejeita CPF com tamanho inválido", () => {
    assert.equal(isValidCpf("123"), false);
  });
});
