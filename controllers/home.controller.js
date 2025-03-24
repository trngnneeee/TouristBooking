module.exports.home = (req, res) => {
    res.render("client/pages/home.pug", {
        pageTitle: "Trang chủ"
    })
}