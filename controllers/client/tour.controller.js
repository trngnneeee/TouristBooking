const Category = require("../../models/category.model");
const Cities = require("../../models/cities.model");
const Tours = require("./../../models/tour.model");
const moment = require("moment");

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    
    // Tạo đường dẫn
    const tourDetail = await Tours.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });

    if (tourDetail) {
        var data = {
            img: tourDetail.avatar,
            name: tourDetail.name,
            array: [
                {
                    link: "/",
                    title: "Trang Chủ"
                }
            ]
        }

        const category = await Category.findOne({
            _id: tourDetail.category,
            status: "active",
            deleted: false
        });

        if (category && category.parent) {
            const parentCategory = await Category.findOne({
                _id: category.parent,
                status: "active",
                deleted: false
            })
            if (parentCategory) {
                data.array.push({
                    link: `/category/${parentCategory.slug}`,
                    title: `${parentCategory.name}`
                })
            }

            data.array.push({
                link: `/category/${category.slug}`,
                title: `${category.name}`
            })
        }

        data.array.push({
            link: `/tours/detail/${tourDetail.slug}`,
            title: `${tourDetail.name}`
        })

        tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("DD/MM/YYYY");

        const locationDetail = [];
        for (const item of tourDetail.locations)
        {
            const locationName = await Cities.findOne({
                _id: item
            })
            locationDetail.push(locationName);
        }
        tourDetail.locationDetail = locationDetail;

        res.render("client/pages/detail.pug", {
            pageTitle: "Chi tiết tour",
            data: data,
            tourDetail: tourDetail
        })

    }
    else res.redirect(`/`);
}