# Ride API contracts

Sanitized, server-side API structure for integrating authorized inDrive,
Yango, and Bykea provider contracts. This repository documents request and
response shapes and provides fail-closed adapter skeletons without publishing
live credentials or captured consumer-session data.

## Providers

| Provider | Code | Documentation |
| --- | --- | --- |
| inDrive | [`src/providers/indrive`](./src/providers/indrive) | [`docs/indrive.md`](./docs/indrive.md) |
| Yango | [`src/providers/yango`](./src/providers/yango) | [`docs/yango.md`](./docs/yango.md) |
| Bykea | [`src/providers/bykea`](./src/providers/bykea) | [`docs/bykea.md`](./docs/bykea.md) |

See [`docs/architecture.md`](./docs/architecture.md) for the common contract.

## Safety

- Live calls are disabled by default.
- Credentials are read only from backend environment variables.
- `.env` is ignored; `.env.example` contains empty placeholders.
- No tokens, cookies, user IDs, device IDs, fingerprints, signatures, phone
  numbers, captured coordinates, or production responses are included.
- Use only provider-approved server contracts. Consumer-app traffic is not an
  authorization source.

## Local validation

```bash
npm run check
```

The package does not require dependencies and uses the Node.js 18+ Fetch API.

