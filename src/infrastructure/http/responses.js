const { randomUUID } = require("node:crypto");
const {
  ProblemDocument,
  ProblemDocumentExtension,
} = require("http-problem-details");

function sendValidationErrors(res, errors) {
  res.status(400).json({ errors });
}

function sendProblemDetails(res, status, { detail } = {}) {
  const body = new ProblemDocument(
    { status, detail },
    new ProblemDocumentExtension({ traceId: randomUUID() }),
  );
  res.status(status).type("application/problem+json").json(body);
}

function sendOk(res, payload) {
  res.status(200).json(payload);
}

module.exports = {
  sendValidationErrors,
  sendProblemDetails,
  sendOk,
};
