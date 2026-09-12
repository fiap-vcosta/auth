const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN_SECONDS = 1800;

function emitirJwtCliente(
  { jwtClienteKey, jwtClienteIssuer, jwtClienteAudience },
  documento,
) {
  return jwt.sign(
    { documento },
    jwtClienteKey,
    {
      algorithm: "HS256",
      issuer: jwtClienteIssuer,
      audience: jwtClienteAudience,
      expiresIn: JWT_EXPIRES_IN_SECONDS,
    },
  );
}

module.exports = { emitirJwtCliente, JWT_EXPIRES_IN_SECONDS };
