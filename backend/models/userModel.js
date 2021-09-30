const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
    maxLength: [30, ' name cannot exceed 30 characters'],
    minlength: [4, 'name should have more than 4 characters'],
  },
  email: {
    type: String,
    require: [true, 'please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minlength: [8, 'password should be more than 8 characters'],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
//*________________hash password
userSchema.pre('save', async function (next) {
  //? to avoid double hashing of pass
  // todo:on evey update this executes that triggers hashing too,
  //todo: so , if model data is being modified then pass this method => next()
  if (this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//*__________________jwt token
//?we will generate token & store in cookie
userSchema.methods.getJWTToken = function () {
  //this = userSchema , so we r forced to use normal-func to access "this"
  //?when we created jwt token ,
  //?we gave it id as DECODED DATA
  //?we gave it secret key
  //?we gave it expire data

  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//*_____________________compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  //this = userSchema , so we r forced to use normal-func to access "this"

  //since enteredPassword is unhashed
  //since storedPassword is hashed
  //so using compare method of bcrypt
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('users', userSchema);
