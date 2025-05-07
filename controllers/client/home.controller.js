const Tours = require("../../models/tour.model")
const moment = require("moment");

module.exports.home = async (req, res) => {
    // Section 2
    const tourList = await Tours.find({
        deleted: false
    })

    for (const item of tourList)
    {
        if (item.departureDate)
        {
            const departureDate = moment(item.departureDate).format("DD/MM/YYYY");
            item.departureDateFormat = departureDate;
        }
    }
    
    res.render("client/pages/home.pug", {
        pageTitle: "Trang chủ",
        tourList: tourList
    })
}