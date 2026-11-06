const SENSITIVE_KEY = /(authorization|token|secret|password|cookie|session|credential|fingerprint|device|phone|account|profile|signature)/i;

function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !SENSITIVE_KEY.test(key)).map(([key, child]) => [key, sanitize(child)]));
}

module.exports = { sanitize };

