module.exports.edit = (req, res) => {
  res.render("admin/pages/profle-edit.pug", {
    pageTitle: "Thông tin cá nhân"
  })
}

module.exports.changePassword = (req, res) => {
  res.render("admin/pages/profile-change-password.pug", {
    pageTitle: "Đổi mật khẩu"
  })
}