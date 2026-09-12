const { tryNormalizeValidDocumento } = require("../domain/documento");

async function emitirTokenCliente(
  { documento: documentoRaw },
  {
    consultarClientePorDocumento,
    emitirJwtCliente,
    config,
  },
) {
  const documento = tryNormalizeValidDocumento(documentoRaw);
  if (!documento) {
    return {
      ok: false,
      kind: "validation",
      errors: ["Documento inválido."],
    };
  }

  let consulta;
  try {
    consulta = await consultarClientePorDocumento(config, documento);
  } catch (err) {
    return {
      ok: false,
      kind: "bad_gateway",
      title: "Bad Gateway",
      detail: "Falha ao consultar a API",
      cause: err,
    };
  }

  if (consulta.status === 404) {
    return { ok: false, kind: "not_found" };
  }

  if (consulta.status === 401) {
    return {
      ok: false,
      kind: "bad_gateway",
      title: "Bad Gateway",
      detail: "Falha na autenticação de serviço com a API",
    };
  }

  if (consulta.status === 400) {
    return {
      ok: false,
      kind: "validation",
      errors: ["Documento inválido."],
    };
  }

  if (consulta.status !== 200) {
    return {
      ok: false,
      kind: "bad_gateway",
      title: "Bad Gateway",
      detail: "Resposta inesperada da API",
      statusFromApi: consulta.status,
    };
  }

  try {
    const token = emitirJwtCliente(config, documento);
    return { ok: true, token };
  } catch (err) {
    return {
      ok: false,
      kind: "internal",
      title: "Internal Server Error",
      detail: "Falha ao emitir token",
      cause: err,
    };
  }
}

module.exports = { emitirTokenCliente };
