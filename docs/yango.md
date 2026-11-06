# Yango

## Operations

- RouteStats: `POST /3.0/routestats` with route, zone, class, payment, and
  supported vertical structure.
- Nearest drivers: `POST /3.0/nearestdrivers` with point, class, generated
  request ID, and payment structure.

Coordinates use provider-required longitude/latitude array ordering. Driver
responses retain only valid positions and established availability. The HTTPS
origin, bearer credential, client identifier, and any authorized optional
headers are deployment secrets/configuration and are not committed.

