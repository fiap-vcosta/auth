async function consultarClientePorDocumento(
  { apiBaseUrl, serviceAuthKey },
  documento,
  { fetchFn = fetch, timeoutMs = 10_000 } = {},
) {
  const url = `${apiBaseUrl}/api/system/clientes/por-documento/${encodeURIComponent(documento)}`;
  const response = await fetchFn(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Service-Key": serviceAuthKey,
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  return {
    status: response.status,
  };
}

module.exports = { consultarClientePorDocumento };
