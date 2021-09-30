//todo : authentication for private route
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //  to use req.cookie , import cookie parser in app.js
  //                          👇    saved with   "token" keyword in cookie
  const token = req.cookies.token;
  console.log(token);
  //?if user browser dont have any jwt token in their cookies while accessing any private route
  if (!token) {
    return next(new ErrorHandler('please login to access this resource', 401));
  }

  //?if user have jwt token in their while accessing any private route api
  //verifying jwt token if it is valid or not
  //?it returns the decoded data ,that we used when we created jwt in model
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userSchema.findById(decodedData.id);
  next();
});
