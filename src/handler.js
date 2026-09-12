"use strict";

async function handleAuth(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res.status(501).json({ error: "not_implemented" });
}

module.exports = { handleAuth };
