const userSchema = require('../models/userModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

//* Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userSchema.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is a sample id',
      url: 'profilepicUrl',
    },
  });
  //token generated during registration using (.getJWTToken) method of userModel
  // __________________
  // const token = user.getJWTToken();
  // //todo: 201- Created success status
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  // __________________
  sendToken(user, 201, res);
});

//*Login a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //check if user has given password and email both 401-unauthorized
  if (!email || !password) {
    //todo: if email pass not provided 401-not authorized
    return next(new ErrorHandler('please enter email or password', 401));
  }

  //_____had set select:false by default inside model 👇
  const user = await userSchema.findOne({ email: email }).select('+password');
  if (!user) {
    //todo:if user not found 401-unauthorized
    return next(new ErrorHandler('invalid email or password', 401));
  }

  // comparing pass with encrypted pass 👀
  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    //todo: if password not matched 401-unauthorized
    return next(new ErrorHandler('invalid email or password', 401));
  }

  //token generated during registration using (.getJWTToken) method of userModel
  // __________________
  // const token = user.getJWTToken();
  // //todo: 201- Created success status
  // res.status(200).json({
  //   success: true,
  //   token,
  // });
  // __________________
  sendToken(user, 200, res);
});

//*Logout a user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});
