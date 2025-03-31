const AccountAdmin = require("../../models/account-admin.model")

module.exports.login = (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Đăng nhập"
  })
}

module.exports.register = (req, res) => {
  res.render("admin/pages/register.pug", {
    pageTitle: "Đăng ký"
  })
}

module.exports.registerPost = async (req, res) => {
  const {fullName, email, password} = req.body;
  
  // Tìm trong CSDL coi email đã có tồn tại chưa
  const existAccount = await AccountAdmin.findOne({
    email: email
  })
  if (existAccount)
  {
    res.json({
      code: "error",
      message: "Email đã tồn tại!"
    });
    return;
  }
  
  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: password,
    status: "initial"
  });

  await newAccount.save();
  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!"
  });
}

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial.pug", {
    pageTitle: "Tài khoản đã được khởi tạo"
  })
}

module.exports.forgotPassword = (req, res) => {
  res.render("admin/pages/forgot-password.pug", {
    pageTitle: "Quên mật khẩu"
  })
}

module.exports.otpPassword = (req, res) => {
  res.render("admin/pages/otp-password.pug", {
    pageTitle: "Nhập mã OTP"
  })
}

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password.pug", {
    pageTitle: "Đổi mật khẩu"
  })
}