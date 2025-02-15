class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code (e.g., 200 for success, 400 for bad request)
        this.data = data; // Actual response data (e.g., user details, list of products, etc.)
        this.message = message; // A message describing the response
        this.success = statusCode < 400; // If the status code is below 400, it means success; otherwise, it's an error
    }
}
export {ApiResponse}