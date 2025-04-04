const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Đăng nhập"
  })
}

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if (!existAccount)
  {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống"
    });
    return;
  }

  // Giải mã password được mã hóa bởi BcryptJs lib
  const isValidPassword = await bcrypt.compare(password, existAccount.password);
  if (!isValidPassword)
  {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    });
    return;
  }
  if (existAccount.status != "active")
  {
    res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!"
    });
    return;
  }

  // Tạo JWT
  const token = jwt.sign(
    {
    id: existAccount.id,
    email: existAccount.email
    }, 
    process.env.JWT_SECRET, // Chuỗi bảo mật để mã hóa (Sau này chuỗi này sẽ lưu vào env)
    {
      expiresIn: '1d' // Thời gian token hết hạn: 1 ngày
    }
  )

  // Lưu token vào cookie (Không liên quan đến JWT)
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // Thời gian hết hạn token tương ứng milisecond
    httpOnly: true, // Chỉ dùng ở server của ta (Nghiêm ngặt hơn thôi)
    sameSite: "strict" // Chỉ dùng được ở website chúng ta (Nghiêm ngặt hơn thôi)
  });

  res.json({
    code: "success",
    message: "Đăng nhập tài khoản thành công!"
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
  
  // Mã hóa mật khẩu với Bcrypt
  const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên 10 ký tự
  const hashPassword = await bcrypt.hashSync(password, salt);

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashPassword,
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

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  });
}