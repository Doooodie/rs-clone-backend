class ApiError extends Error{
    constructor(statusCode, message) {
        super()
        this.status = statusCode;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(404, message);
    }
    
    static internal(message) {
        return new ApiError(500, message);
    }

    static forbiden(message) {
        return new ApiError(403, message);
    }

}

export default ApiError;
