const { findAllCategory } = require("../../helpers/category.helpers");
const Category = require("../../models/category.model");
const Cities = require("../../models/cities.model");
const Tours = require("../../models/tour.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const slug = req.params.slug;

  // Tạo đường dẫn
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
          link: `/category/${parentCategory.slug}`,
          title: `${parentCategory.name}`
        })
      }

      data.array.push({
        link: `/category/${category.slug}`,
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

    let sort = "";
    if (req.query.sort)
    {
      sort = req.query.sort;
    }

    const limitItem = 6;
    // Đếm tổng số tour trong danh mục
    const totalRecord = await Tours.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItem);

    let page = 1;
    if (req.query.page)
    {
      const tmp = parseInt(req.query.page);
      if (tmp > 0) page = tmp;
    }
    if (totalRecord != 0 && page > totalPage) page = totalPage;
    const skip = (page - 1) * limitItem;

    const pagination = {
      totalRecord: totalRecord,
      totalPage: totalPage,
      skip: skip
    }

    let tourList = [];
    if (sort)
      tourList = await Tours.find(find).sort({priceNewAdult: sort}).limit(limitItem).skip(skip);
    else tourList = await Tours.find(find).limit(limitItem).skip(skip);

    for (const item of tourList) {
      if (item.departureDate) {
        const departureDate = moment(item.departureDate).format("DD/MM/YYYY");
        item.departureDateFormat = departureDate;
      }
    }

    // Danh sách tỉnh
    const cityList = await Cities.find({});

    res.render("client/pages/tours.pug", {
      pageTitle: "Danh sách tour",
      data: data,
      category: category,
      tourList: tourList,
      cityList: cityList,
      pagination: pagination
    })
  }
  else {
    res.redirect("/");
  }

}