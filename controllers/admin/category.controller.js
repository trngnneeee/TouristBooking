const { buildCategoryTree } = require("../../helpers/category.helpers")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  for (const item of categoryList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated.fullName
    }
    if (item.updatedBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.updatedByFullName = infoAccountCreated.fullName
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục",
    categoryList: categoryList
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryListTree = buildCategoryTree(categoryList);

  res.render("admin/pages/category-create.pug", {
    pageTitle: "Tạo danh mục",
    categoryList: categoryListTree
  })
}

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  }
  else {
    // Đếm số bản ghi trong CSDL
    const totalRecord = await Category.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;

  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Category(req.body);
  await newRecord.save();

  req.flash("success", "Tạo danh mục thành công!");
  /*
    Trả về cho FE 1 đối tượng message {
      success: "Tạo danh mục thành công!"
    }
  */

  res.json({
    code: "success",
  })
}

module.exports.edit = async (req, res) => {
  try {
    const categoryList = await Category.find({
      deleted: false
    })
  
    const id = req.params.id;
    const categoryDetail = await Category.findOne({
      _id: id
    })
  
    res.render("admin/pages/category-edit.pug", {
      pageTitle: "Chỉnh sửa danh mục",
      categoryList: categoryList,
      categoryDetail: categoryDetail
    })
  }
  catch(error)
  {
    res.redirect(`/${pathAdmin}/category/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    }
    else {
      // Đếm số bản ghi trong CSDL
      const totalRecord = await Category.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.updatedBy = req.account.id;

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await Category.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật danh mục thành công!");

    res.json({
      code: "success",
    })
  }
  catch(error)
  {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.delete = async (req, res) => {
  try{
    const id = req.params.id;

    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deleteAt: Date.now()
    })

    req.flash("success", "Xóa danh mục thành công!");
    res.json({
      code: "success"
    });
  }
  catch(error)
  {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}