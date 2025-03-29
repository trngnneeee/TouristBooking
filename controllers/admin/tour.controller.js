module.exports.list = (req, res) => {
  res.render("admin/pages/tour-list.pug", {
    pageTitle: "Quản lý tour"
  })
}

module.exports.create = (req, res) => {
  res.render("admin/pages/tour-create.pug", {
    pageTitle: "Tạo tour"
  })
}

module.exports.trash = (req, res) => {
  res.render("admin/pages/tour-trash.pug", {
    pageTitle: "Thùng rác tour"
  })
}