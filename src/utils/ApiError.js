class ApiError extends Error {
  constructor(
    statusCode,
    message = "Some went wrong",
    errors = [],
    stack = ""
  ) {
     super(message); // Call the parent Error class constructor with the message

     this.statusCode = statusCode; // The HTTP status code of the error
     this.data = null; // Optional data (not used in this case)
     this.message = message; // The error message
     this.success = false; // Indicates that the request was not successful
     this.errors = errors; // Array of specific error details

     // Custom stack trace handling
     if (stack) {
       this.stack = stack; // If a stack trace is provided, use it
     } else {
       Error.captureStackTrace(this, this.constructor); // Otherwise, generate one automatically
     }
  }
}

export { ApiError }; // Export the class for use in other files
