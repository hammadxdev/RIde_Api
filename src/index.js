const { createIndriveApi } = require("./providers/indrive");
const { createYangoApi } = require("./providers/yango");
const { createBykeaApi } = require("./providers/bykea");

function common(env, prefix) {
  return { enabled: String(env[`${prefix}_ENABLED`] || "false").toLowerCase() === "true", baseUrl: env[`${prefix}_BASE_URL`] || "", accessToken: env[`${prefix}_ACCESS_TOKEN`] || "", timeoutMs: Number(env.REQUEST_TIMEOUT_MS || 10000) };
}

function createApis(env = process.env, fetchImpl = globalThis.fetch) {
  return {
    indrive: createIndriveApi({ ...common(env, "INDRIVE"), pricingPath: env.INDRIVE_PRICING_PATH || "" }, fetchImpl),
    yango: createYangoApi({ ...common(env, "YANGO"), clientId: env.YANGO_CLIENT_ID || "", routeStatsPath: env.YANGO_ROUTE_STATS_PATH || "/3.0/routestats", nearestDriversPath: env.YANGO_NEAREST_DRIVERS_PATH || "/3.0/nearestdrivers" }, fetchImpl),
    bykea: createBykeaApi({ ...common(env, "BYKEA"), farePath: env.BYKEA_FARE_PATH || "", nearbyPath: env.BYKEA_NEARBY_PATH || "" }, fetchImpl),
  };
}

module.exports = { createApis };

