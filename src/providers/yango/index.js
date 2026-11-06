const crypto = require("node:crypto");
const { requestJson } = require("../../core/http");
const { coordinates, authorizedConfig } = require("../../core/validation");

function createYangoApi(config, fetchImpl) {
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${config.accessToken}`, ...(config.clientId ? { "X-Client-ID": config.clientId } : {}) });
  return {
    async routeStats({ pickup, destination, zone, className, paymentType = "cash" }) {
      authorizedConfig(config, "Yango");
      const a = coordinates(pickup, "Pickup");
      const b = coordinates(destination, "Destination");
      const body = { zone_name: zone, selected_class: className, route: [[a.longitude, a.latitude], [b.longitude, b.latitude]], tariff_requirements: [{ class: className }], payment: { type: paymentType }, supported_verticals: ["taxi"] };
      const data = await requestJson({ url: new URL(config.routeStatsPath, config.baseUrl).toString(), method: "POST", headers: headers(), body, timeoutMs: config.timeoutMs, fetchImpl });
      return { provider: "yango", tariffs: Array.isArray(data?.service_levels) ? data.service_levels : Array.isArray(data?.tariffs) ? data.tariffs : [] };
    },
    async nearestDrivers({ location, className, paymentType = "cash" }) {
      authorizedConfig(config, "Yango");
      const point = coordinates(location, "Location");
      const body = { id: crypto.randomUUID(), point: [point.longitude, point.latitude], classes: [className], current_drivers: [], simplify: true, payment: { type: paymentType } };
      const data = await requestJson({ url: new URL(config.nearestDriversPath, config.baseUrl).toString(), method: "POST", headers: headers(), body, timeoutMs: config.timeoutMs, fetchImpl });
      return { provider: "yango", drivers: normalizeDrivers(data?.drivers) };
    },
  };
}

function normalizeDrivers(drivers) {
  if (!Array.isArray(drivers)) return [];
  return drivers.map((driver) => {
    const point = Array.isArray(driver?.positions) ? driver.positions.at(-1) : null;
    const latitude = Number(point?.lat); const longitude = Number(point?.lon);
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude, available: typeof driver.free === "boolean" ? driver.free : null } : null;
  }).filter(Boolean);
}

module.exports = { createYangoApi, normalizeDrivers };

