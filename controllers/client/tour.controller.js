const Tour = require("./../../models/tour.model");

module.exports.list = async (req, res) => {
    const tourList = await Tour.find({});

    res.render("client/pages/tour-list.pug", {
        pageTitle: "Danh sách tour",
        tourList: tourList
    })
}