const { ProviderError } = require("./errors");

async function requestJson({ url, method = "GET", headers = {}, body, timeoutMs = 10000, fetchImpl = globalThis.fetch }) {
  if (typeof fetchImpl !== "function") throw new ProviderError("TRANSPORT_UNAVAILABLE", "HTTP transport is unavailable");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method,
      headers: { Accept: "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { throw new ProviderError("INVALID_RESPONSE", "Provider returned malformed JSON", response.status); }
    if (!response.ok) throw new ProviderError("UPSTREAM_ERROR", "Provider request failed", response.status);
    return data;
  } catch (error) {
    if (error?.name === "AbortError") throw new ProviderError("TIMEOUT", "Provider request timed out");
    if (error instanceof ProviderError) throw error;
    throw new ProviderError("NETWORK_ERROR", "Provider transport failed");
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { requestJson };

