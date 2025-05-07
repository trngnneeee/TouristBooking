var jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');
const Role = require('../../models/role.model');

module.exports.verifyToken = async (req, res, next) => {
  // Lấy token nhờ Cookie-parser lib
  const token = req.cookies.token;

  if (!token) // Nếu không có token -> Chuyển hướng sang trang login
  {
    res.redirect(`/${pathAdmin}/account/login`);
    return;
  }

  try {
    // Lấy token trong cookie, giải mã -> Nếu giải mã được thì tiếp tục, không thì rơi vào catch
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sau khi giải mã xong, dựa vào thông tin giải mã để tìm trong CSDL coi có tài khoản nào như vậy không để duy trì đăng nhập
    const { id, email } = decoded;

    const existAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      status: "active"
    })

    if (!existAccount) 
    {
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    // Biến dùng bên FE
    res.locals.account = existAccount; 

    if (existAccount.role != "")
    {
      const roleInfo = await Role.findOne({
        _id: existAccount.role
      })
      res.locals.account.roleInfo = roleInfo.name;
      res.locals.permissions = roleInfo.permissions;
      req.permissions = roleInfo.permissions;
    }

    // Biến dùng bên BE
    req.account = existAccount;

    next();
  } 
  catch(error)
  {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }

}