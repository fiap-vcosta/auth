const REQUIRED = [
  "API_BASE_URL",
  "JWT_CLIENTE_KEY",
  "JWT_CLIENTE_ISSUER",
  "JWT_CLIENTE_AUDIENCE",
  "SERVICE_AUTH_KEY",
];

function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((key) => !env[key] || String(env[key]).trim() === "");
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missing.join(", ")}`);
  }

  return {
    apiBaseUrl: String(env.API_BASE_URL).replace(/\/$/, ""),
    jwtClienteKey: env.JWT_CLIENTE_KEY,
    jwtClienteIssuer: env.JWT_CLIENTE_ISSUER,
    jwtClienteAudience: env.JWT_CLIENTE_AUDIENCE,
    serviceAuthKey: env.SERVICE_AUTH_KEY,
  };
}

module.exports = { loadConfig, REQUIRED };
