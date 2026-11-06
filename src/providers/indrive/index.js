const { requestJson } = require("../../core/http");
const { coordinates, authorizedConfig } = require("../../core/validation");
const { sanitize } = require("../../core/sanitize");

function createIndriveApi(config, fetchImpl) {
  return {
    async fares({ pickup, destination, categoryId }) {
      authorizedConfig(config, "inDrive");
      const origin = coordinates(pickup, "Pickup");
      const target = coordinates(destination, "Destination");
      const data = await requestJson({
        url: new URL(config.pricingPath, config.baseUrl).toString(),
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.accessToken}` },
        body: { order_type_id: categoryId, route: [origin, target] },
        timeoutMs: config.timeoutMs,
        fetchImpl,
      });
      return normalizeIndrive(data);
    },
  };
}

function normalizeIndrive(data) {
  const items = Array.isArray(data?.calculations) ? data.calculations : data ? [data] : [];
  const multiplier = Number(data?.currency?.multiplier ?? data?.price?.currency?.multiplier);
  const currency = data?.currency?.code ?? data?.price?.currency?.code ?? null;
  return items.map((item) => ({
    provider: "indrive",
    categoryId: item?.order_type_id == null ? null : String(item.order_type_id),
    fare: Number.isFinite(Number(item?.price)) && multiplier > 0 ? Number(item.price) / multiplier : null,
    currency,
    available: Number.isFinite(Number(item?.price)),
    metadata: sanitize({ ttl: data?.ttl ?? item?.ttl, isRush: item?.is_rush ?? item?.rush_hour?.is_rush }),
  }));
}

module.exports = { createIndriveApi, normalizeIndrive };

