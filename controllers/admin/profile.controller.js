const AccountAdmin = require("../../models/account-admin.model");

module.exports.edit = (req, res) => {
  res.render("admin/pages/profle-edit.pug", {
    pageTitle: "Thông tin cá nhân"
  })
}

module.exports.editPatch = async (req, res) => {
  if (req.file)
    req.body.avatar = req.file.path;
  else delete req.body.avatar;

  req.body.updatedBy = req.account.id;
  req.body.updatedAt = Date.now();

  await AccountAdmin.updateOne({
    _id: req.account.id,
    deleted: false
  }, req.body);

  req.flash("success", "Đổi thông tin tài khoản thành công!");
  res.json({
    code: "success"
  })
}

module.exports.changePassword = (req, res) => {
  res.render("admin/pages/profile-change-password.pug", {
    pageTitle: "Đổi mật khẩu"
  })
}