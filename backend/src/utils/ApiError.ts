class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message = "Api Error") {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ApiError;