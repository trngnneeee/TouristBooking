module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard.pug", {
    pageTitle: "Tổng quan"
  })
}