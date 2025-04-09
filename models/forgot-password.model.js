const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: String,
  otp: String,
  expireAt: { // Chỉ định thời gian hết hạn cho bản ghi này
    type: Date,
    expires: 0
  }
})

const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

module.exports = ForgotPassword;