const { findAllCategory } = require("../../helpers/category.helpers");
const Category = require("../../models/category.model");
const Tours = require("../../models/tour.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const slug = req.params.slug;

  const category = await Category.findOne({
    deleted: false,
    slug: slug,
    status: "active"
  });

  if (category) {
    var data = {
      img: category.avatar,
      name: category.name,
      array: [
        {
          link: "/",
          title: "Trang Chủ"
        }
      ]
    }

    if (category.parent) {
      const parentCategory = await Category.findOne({
        _id: category.parent,
        status: "active",
        deleted: false
      })
      if (parentCategory) {
        data.array.push({
          link: `/${parentCategory.slug}`,
          title: `${parentCategory.name}`
        })
      }

      data.array.push({
        link: `/${category.slug}`,
        title: `${category.name}`
      })
    }

    // Lấy ra danh sách các tour
    const categoryList = await Category.find({
      deleted: false
    })
    const nationalTourIdList = findAllCategory(categoryList, category.id);

    const find = {
      deleted: false,
      category: { $in: nationalTourIdList }
    }

    const tourList = await Tours.find(find);

    for (const item of tourList) {
      if (item.departureDate) {
        const departureDate = moment(item.departureDate).format("DD/MM/YYYY");
        item.departureDateFormat = departureDate;
      }
    }

    const totalTour = await Tours.countDocuments(find);

    res.render("client/pages/tours.pug", {
      pageTitle: "Danh sách tour",
      data: data,
      category: category,
      tourList: tourList,
      totalTour: totalTour
    })
  }
  else {
    res.redirect("/");
  }

}