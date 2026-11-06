# inDrive

## Operations

- Pricing: authorized `POST` to the configured pricing path.
- Request: category ID plus pickup and destination coordinates.
- Response: one or more provider calculations normalized to category, fare,
  currency, availability, TTL, and rush-state metadata.

Provider monetary integers are divided only by a positive response currency
multiplier. Missing or invalid money fields produce `null`, never a guessed fare.
Bearer credentials stay on the backend. Session renewal, device identity, and
fingerprint values are deliberately outside this public contract skeleton.

