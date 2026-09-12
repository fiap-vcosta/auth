const jwt = require("jsonwebtoken");

function emitirJwtCliente(
  { jwtClienteKey, jwtClienteIssuer, jwtClienteAudience, jwtExpiresInSeconds = 1800 },
  documento,
) {
  return jwt.sign(
    { cpf: documento },
    jwtClienteKey,
    {
      algorithm: "HS256",
      issuer: jwtClienteIssuer,
      audience: jwtClienteAudience,
      expiresIn: jwtExpiresInSeconds,
    },
  );
}

module.exports = { emitirJwtCliente };
