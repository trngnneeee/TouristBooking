const { buildCategoryTree } = require("../../helpers/category.helpers")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const Cities = require("../../models/cities.model")
const Tours = require("../../models/tour.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

  const tourList = await Tours
    .find(find)
    .sort({
      position: "desc"
    });

  for (const item of tourList) {
    if (item.createdBy) {
      const account = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = account.fullName
    }
    if (item.updatedBy) {
      const account = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = account.fullName
    }
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");

    item.priceAdultFormat = item.priceNewAdult.toLocaleString();
    item.priceChildrenFormat = item.priceNewChildren.toLocaleString();
    item.priceBabyFormat = item.priceNewBaby.toLocaleString();
  }

  res.render("admin/pages/tour-list.pug", {
    pageTitle: "Quản lý tour",
    tourList: tourList
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

module.exports.edit = async (req, res) => {
  try {
    const categoryList = await Category.find({
      deleted: false
    })

    const categoryListTree = buildCategoryTree(categoryList);

    const citiesList = await Cities.find({});

    const id = req.params.id;
    const detailTour = await Tours.findOne({
      _id: id
    })

    detailTour.departureDateFormat = moment(detailTour.departureDate).format("YYYY-MM-DD");

    res.render("admin/pages/tour-edit.pug", {
      pageTitle: "Chỉnh sửa tour",
      categoryList: categoryListTree,
      citiesList: citiesList,
      detailTour: detailTour
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    // Format dữ liệu
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    }
    else {
      // Đếm số bản ghi trong CSDL
      const totalRecord = await Tours.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

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

    await Tours.updateOne({
      deleted: false,
      _id: id
    }, req.body)

    req.flash("success", "Chỉnh sửa tour thành công!")
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Tours.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deleteAt: Date.now()
    })

    req.flash("success", "Xóa tour thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.trash = (req, res) => {
  res.render("admin/pages/tour-trash.pug", {
    pageTitle: "Thùng rác tour"
  })
}