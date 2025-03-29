module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list.pug", {
    pageTitle: "Cài đặt chung"
  })
}

module.exports.websiteInfo = (req, res) => {
  res.render("admin/pages/setting-website-info.pug", {
    pageTitle: "Thông tin website"
  })
}

module.exports.accountAdminList = (req, res) => {
  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị"
  })
}

module.exports.accountAdminCreate = (req, res) => {
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị"
  })
}

module.exports.roleList = (req, res) => {
  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: "Nhóm quyền"
  })
}

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: "Tạo nhóm quyền"
  })
}