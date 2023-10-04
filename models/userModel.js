const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: [6, "Password Length should be chracter Long"],
  },
  customerId: {
    type: String,
    default: "",
  },
  subscription: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  //updaate
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//checking for match password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//SIGN TOKEN

userSchema.methods.getSignedToken = function (res) {
  const accessToken = JWT.sign(
    { id: this._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn:process.env.JWT_ACCESS_EXPIRESIN }
  );
  const refreshToken = JWT.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXPIRESIN }
  );
  res.cookie("refreshToken", ""+refreshToken, {
    maxAge: 86400 * 7000,
    httpOnly: true,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
