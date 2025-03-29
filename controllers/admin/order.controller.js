module.exports.list = (req, res) => {
  res.render("admin/pages/order-list.pug", {
    pageTitle: "Quản lý đơn hàng"
  })
}

module.exports.edit = (req, res) => {
  res.render("admin/pages/order-edit.pug", {
    pageTitle: "Đơn hàng: OD000001"
  })
}