const { buildCategoryTree } = require("../../helpers/category.helpers")
const Category = require("../../models/category.model")
const Cities = require("../../models/cities.model")
const Tours = require("../../models/tour.model")

module.exports.list = (req, res) => {
  res.render("admin/pages/tour-list.pug", {
    pageTitle: "Quản lý tour"
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryListTree = buildCategoryTree(categoryList);

  const citiesList = await Cities.find({});
  
  res.render("admin/pages/tour-create.pug", {
    pageTitle: "Tạo tour",
    categoryList: categoryListTree,
    citiesList: citiesList
  })
}

module.exports.createPost = async (req, res) => {
  // Format dữ liệu
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  }
  else {
    // Đếm số bản ghi trong CSDL
    const totalRecord = await Tours.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.avatar = req.file ? req.file.path : "";

  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
  
  req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
  req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceAdult;
  req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceAdult;

  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;

  req.body.schedules = JSON.parse(req.body.schedules);
  
  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  // End Format dữ liệu
  
  const newRecord = new Tours(req.body);
  await newRecord.save();

  req.flash("success", "Tạo tour thành công!");
  res.json({
    code: "success"
  })
}

module.exports.trash = (req, res) => {
  res.render("admin/pages/tour-trash.pug", {
    pageTitle: "Thùng rác tour"
  })
}