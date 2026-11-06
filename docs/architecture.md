# Architecture

```text
Application -> provider facade -> provider adapter -> authorized HTTPS API
            <- normalized result <- validation and sanitization <- response
```

Each provider lives in its own folder and exposes only its supported operations.
Shared code validates coordinates, applies timeouts, classifies safe errors, and
removes sensitive metadata. Live mode is opt-in and fails closed when the HTTPS
origin or backend credential is missing.

Normalized results identify the provider, category, fare/currency or driver
location, availability, and sanitized metadata. Unknown values stay `null`.

