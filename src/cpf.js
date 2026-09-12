function normalizeCpf(input) {
  return String(input ?? "").replace(/\D/g, "");
}

function isValidCpf(digits) {
  if (!/^\d{11}$/.test(digits)) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }
  return true;
}

module.exports = { normalizeCpf, isValidCpf };
