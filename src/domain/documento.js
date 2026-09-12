const { cpf, cnpj } = require("cpf-cnpj-validator");

function normalizeDocumento(input) {
  return String(input ?? "").replace(/[.\-/]/g, "").trim();
}

function tryNormalizeValidDocumento(input) {
  const normalized = normalizeDocumento(input);
  if (!normalized) {
    return null;
  }

  if (cpf.isValid(normalized)) {
    return cpf.strip(normalized);
  }

  if (cnpj.isValid(normalized)) {
    return cnpj.strip(normalized);
  }

  return null;
}

module.exports = { normalizeDocumento, tryNormalizeValidDocumento };
