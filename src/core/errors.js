class ProviderError extends Error {
  constructor(code, message, status = null) {
    super(message);
    this.name = "ProviderError";
    this.code = code;
    this.status = status;
  }
}

module.exports = { ProviderError };

