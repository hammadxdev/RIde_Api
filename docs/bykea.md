# Bykea

## Operations

- Fare estimate: authorized request to the configured fare path with pickup,
  destination, and serialized service-code structure.
- Nearby/ETA: authorized request to the configured nearby path with location
  and service code.

Response entries are normalized using the provider category field and numeric
fare when present. Undocumented service codes are not given invented meanings.
Any provider-required user, device, application, signing, or session values must
come from an approved server contract and secret store; they are not included
in this repository.

