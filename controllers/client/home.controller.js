const { findAllCategory } = require("../../helpers/category.helpers");
const Category = require("../../models/category.model");
const Tours = require("../../models/tour.model")
const moment = require("moment");

module.exports.home = async (req, res) => {
    // Section 2
    const tourList = await Tours.find({
        deleted: false
    })

    // Section 4
    const nationalTourId = "681b496fc12d9cea3e49176b";
    const categoryList = await Category.find({
        deleted: false
    })
    const nationalTourIdList = findAllCategory(categoryList, nationalTourId);

    const dataSection4 = await Tours.find({
        deleted: false,
        category: { $in: nationalTourIdList }
    }).limit(4);

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
        tourList: tourList,
        dataSection4: dataSection4
    })
}