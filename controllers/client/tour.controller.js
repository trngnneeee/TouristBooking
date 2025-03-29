const Tour = require("./../../models/tour.model");

module.exports.list = async (req, res) => {
    const tourList = await Tour.find({});

    res.render("client/pages/tours.pug", {
        pageTitle: "Danh sách tour",
        tourList: tourList
    })
}

module.exports.detail = async (req, res) => {
    res.render("client/pages/detail.pug", {
        pageTitle: "Chi tiết tour"
    })
}