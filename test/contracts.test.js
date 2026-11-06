const test = require("node:test");
const assert = require("node:assert/strict");
const { sanitize } = require("../src/core/sanitize");
const { normalizeDrivers } = require("../src/providers/yango");

test("sanitizer removes sensitive fields recursively", () => {
  assert.deepEqual(sanitize({ fare: 1, access_token: "redacted", nested: { deviceId: "redacted", eta: 2 } }), { fare: 1, nested: { eta: 2 } });
});

test("Yango driver mapper rejects invalid positions", () => {
  assert.deepEqual(normalizeDrivers([{ positions: [{ lat: "invalid", lon: 1 }] }]), []);
});

