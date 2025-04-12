var jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');

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
      res.clearCookies("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }
    
    req.account = existAccount;

    res.locals.account = existAccount; // Các file PUG sẽ lấy được các giá trị này

    next();
  } 
  catch(error)
  {
    res.clearCookies("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }

}