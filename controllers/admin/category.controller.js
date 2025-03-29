module.exports.list = (req, res) => {
  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục"
  })
}

module.exports.create = (req, res) => {
  res.render("admin/pages/category-create.pug", {
    pageTitle: "Tạo danh mục"
  })
}