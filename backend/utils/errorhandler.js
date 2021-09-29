// inherit Error default cls of node  to ErrorHandler cls
class ErrorHandler extends Error {
  constructor(message, status) {
    // super is method of Error default cls of node which is inherited
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
