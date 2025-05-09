const Tour = require("./../../models/tour.model");

module.exports.detail = async (req, res) => {
    res.render("client/pages/detail.pug", {
        pageTitle: "Chi tiết tour"
    })
}