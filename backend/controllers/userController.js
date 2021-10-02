const crypto = require('crypto');
const userSchema = require('../models/userModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendEmail = require('../utils/sendEmail');
const sendToken = require('../utils/jwtToken');

//* Register a user --user/admin
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

//*Login a user --user/admin
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400));
  }

  const user = await userSchema.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

//*Logout a user --user/admin
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

//* Forgot Password --GETLINK --user/admin
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // we again need to save doc after making both undefined

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//* Reset Password --user/admin
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await userSchema.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Reset Password Token is invalid or has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not password', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//* Get a userDetail Aft Login --user/admin  (their own profile detail)
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  //todo: in auth.js if user is loggedIn , req.user= {user document who has logged in }
  const user = await userSchema.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//* update User Password Aft Login --user/admin
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  //todo: in auth.js if user is loggedIn , req.user= {user document who has logged in }
  //we need to access password too from this document so, 👇

  const user = await userSchema.findById(req.user.id).select('+password');
  //todo: check if old pass match with pass in db
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password is incorrect', 401));
  }
  //todo: check  new pass === confirm pass
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler('Password doesnot match with confirm password', 401)
    );
  }
  //todo: assign req.body.newPassword to user.password
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//* updateProfileData
exports.updateProfileData = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //We will add cloudinary later
  const user = await userSchema.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//! get all users --admin ( see all users avaiable)
exports.getAllUserAdmin = catchAsyncErrors(async (req, res, next) => {
  const users = await userSchema.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//! get single userDetail --admin ( see userDetail of anybody by admin)
exports.getUserDetailAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//! update role of any user --admin ( change userDetail of any user )
exports.updateAnyProfileAdmin = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  //We will add cloudinary later
  const user = await userSchema.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//* delete user --admin
exports.deleteAnyUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findById(req.params.id);
  //We will remove cloudinary later

  if (!user) {
    return next(
      new ErrorHandler(`user do not exist with id ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'user deleted successfully',
  });
});
