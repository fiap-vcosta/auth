const functions = require("@google-cloud/functions-framework");
const { handleAuth } = require("./handler");

functions.http("auth", handleAuth);

module.exports = { handleAuth };
