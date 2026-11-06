const { ProviderError } = require("./errors");

function coordinates(value, label) {
  const latitude = Number(value?.latitude ?? value?.lat);
  const longitude = Number(value?.longitude ?? value?.lng);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new ProviderError("INVALID_COORDINATES", `${label} coordinates are invalid`);
  }
  return { latitude, longitude };
}

function authorizedConfig(config, provider) {
  if (!config?.enabled) throw new ProviderError("PROVIDER_DISABLED", `${provider} is disabled`);
  if (!config?.baseUrl || !config?.accessToken) throw new ProviderError("AUTH_REQUIRED", `${provider} authorization is not configured`);
  let parsed;
  try { parsed = new URL(config.baseUrl); } catch { throw new ProviderError("INVALID_CONFIG", `${provider} base URL is invalid`); }
  if (parsed.protocol !== "https:") throw new ProviderError("INVALID_CONFIG", `${provider} base URL must use HTTPS`);
}

module.exports = { coordinates, authorizedConfig };

