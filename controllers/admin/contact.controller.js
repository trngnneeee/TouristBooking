module.exports.list = (req, res) => {
  res.render("admin/pages/contact-list.pug", {
    pageTitle: "Thông tin liên hệ"
  })
}
