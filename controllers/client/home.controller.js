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

    // Section 5
    const internationalTourId = "681b4977c12d9cea3e49177a";
    const innationalTourIdList = findAllCategory(categoryList, internationalTourId);

    const dataSection5 = await Tours.find({
        deleted: false,
        category: { $in: innationalTourIdList }
    }).limit(4);

    const path = {};
    const nationalCategory = await Category.findOne({
        _id: nationalTourId
    })
    const internationalCategory = await Category.findOne({
        _id: internationalTourId
    })
    path.nationalPath = nationalCategory.slug
    path.internationalPath = internationalCategory.slug
    
    res.render("client/pages/home.pug", {
        pageTitle: "Trang chủ",
        tourList: tourList,
        dataSection4: dataSection4,
        dataSection5: dataSection5,
        path: path
    })
}