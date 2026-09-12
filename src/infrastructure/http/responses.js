const { randomUUID } = require("node:crypto");

const PROBLEM_TYPES = {
  400: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  401: "https://tools.ietf.org/html/rfc9110#section-15.5.2",
  404: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  405: "https://tools.ietf.org/html/rfc9110#section-15.5.6",
  500: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
  502: "https://tools.ietf.org/html/rfc9110#section-15.6.3",
};

function sendValidationErrors(res, errors) {
  res.status(400).json({ errors });
}

function sendProblemDetails(res, status, title, { detail } = {}) {
  const body = {
    type: PROBLEM_TYPES[status] ?? "about:blank",
    title,
    status,
    traceId: randomUUID(),
  };
  if (detail) {
    body.detail = detail;
  }
  res.status(status).type("application/problem+json").json(body);
}

function sendOk(res, payload) {
  res.status(200).json(payload);
}

module.exports = {
  PROBLEM_TYPES,
  sendValidationErrors,
  sendProblemDetails,
  sendOk,
};
