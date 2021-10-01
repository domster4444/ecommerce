const ErrorHandler = require('../utils/errorhandler');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  //!Wrong mongodb id error
  if (err.name === 'CastError') {
    const message = `Resource not found.Invalid : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //!Mongoose duplicate key error
  if ((err.code = 11000)) {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //!Wrong JWT error
  if ((err.code = 'JsonWebTokenError')) {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  //!JWT Expire error
  if ((err.code = 'TokenExpiredError')) {
    const message = `Json Web Token is Expired, Please Login Again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
