class ApiError extends Error {
  status: number;

  constructor(statusCode: number, message: string) {
    super();
    this.status = statusCode;
    this.message = message;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }
}

export default ApiError;
