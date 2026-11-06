const { requestJson } = require("../../core/http");
const { coordinates, authorizedConfig } = require("../../core/validation");
const { sanitize } = require("../../core/sanitize");

function createBykeaApi(config, fetchImpl) {
  const auth = () => ({ Authorization: `Bearer ${config.accessToken}` });
  return {
    async fares({ pickup, destination, serviceCodes = [] }) {
      authorizedConfig(config, "Bykea");
      const a = coordinates(pickup, "Pickup"); const b = coordinates(destination, "Destination");
      const url = new URL(config.farePath, config.baseUrl);
      Object.entries({ s_lat: a.latitude, s_lng: a.longitude, e_lat: b.latitude, e_lng: b.longitude, service_codes: JSON.stringify(serviceCodes) }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
      const data = await requestJson({ url: url.toString(), headers: auth(), timeoutMs: config.timeoutMs, fetchImpl });
      return normalizeBykea(data);
    },
    async nearby({ location, serviceCode }) {
      authorizedConfig(config, "Bykea");
      const point = coordinates(location, "Location");
      const url = new URL(config.nearbyPath, config.baseUrl);
      Object.entries({ latitude: point.latitude, longitude: point.longitude, service_code: serviceCode }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
      const data = await requestJson({ url: url.toString(), headers: auth(), timeoutMs: config.timeoutMs, fetchImpl });
      return { provider: "bykea", data: sanitize(data?.data ?? data) };
    },
  };
}

function normalizeBykea(data) {
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => ({ provider: "bykea", categoryId: row?.mstr == null ? null : String(row.mstr), fare: Number.isFinite(Number(row?.fare)) ? Number(row.fare) : null, currency: row?.currency ?? null, metadata: sanitize(row) }));
}

module.exports = { createBykeaApi, normalizeBykea };

