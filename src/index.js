const functions = require("@google-cloud/functions-framework");
const { handleAuth } = require("./presentation/auth-handler");

functions.http("auth", handleAuth);

module.exports = { handleAuth };
