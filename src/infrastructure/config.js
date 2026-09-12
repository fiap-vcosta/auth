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

  const expiresRaw = env.JWT_EXPIRES_IN_SECONDS;
  let jwtExpiresInSeconds = 1800;
  if (expiresRaw !== undefined && String(expiresRaw).trim() !== "") {
    const parsed = Number(expiresRaw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error("JWT_EXPIRES_IN_SECONDS deve ser um inteiro positivo");
    }
    jwtExpiresInSeconds = parsed;
  }

  return {
    apiBaseUrl: String(env.API_BASE_URL).replace(/\/$/, ""),
    jwtClienteKey: env.JWT_CLIENTE_KEY,
    jwtClienteIssuer: env.JWT_CLIENTE_ISSUER,
    jwtClienteAudience: env.JWT_CLIENTE_AUDIENCE,
    serviceAuthKey: env.SERVICE_AUTH_KEY,
    jwtExpiresInSeconds,
  };
}

module.exports = { loadConfig, REQUIRED };
