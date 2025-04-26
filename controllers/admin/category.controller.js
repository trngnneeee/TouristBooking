const { buildCategoryTree } = require("../../helpers/category.helpers")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require("moment");
const slugify = require('slugify');

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }
  // End Lọc theo trạng thái

  // Lọc theo người tạo
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }
  // End Lọc theo người tạo

  // Lọc theo ngày
  const dateFilter = {};

  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length >= 1) {
    find.createdAt = dateFilter;
  }
  // End Lọc theo ngày

  // Tìm kiếm
  if (req.query.search)
  {
    const search = slugify(req.query.search, {
      lower: true
    });
    const searchRegex = new RegExp(search);
    find.slug = searchRegex;
  }
  // End Tìm kiếm

  // Phân trang
  const limitItem = 3;
  let page =  1;
  if (req.query.page)
  {
    const currentPage = parseInt(req.query.page);
    if (currentPage > 0)
      page = currentPage;
  }
  // End Phân trang

  const totalRecord = await Category.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  if (page > totalPage && totalPage != 0)
  {
    page = totalPage
  }
  const skip = limitItem * (page - 1);
  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    skip: limitItem * (page - 1)
  }

  const categoryList = await Category
    .find(find)
    .sort({
    position: "desc"
  })
    .limit(limitItem)
    .skip(skip);

  for (const item of categoryList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated.fullName
    }
    if (item.updatedBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoAccountCreated.fullName
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  const accountAdminList = await AccountAdmin.find({}).select("fullName");

  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục",
    categoryList: categoryList,
    accountAdminList: accountAdminList,
    pagination: pagination
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

    const categoryListTree = buildCategoryTree(categoryList);

    const id = req.params.id;
    const categoryDetail = await Category.findOne({
      _id: id
    })

    res.render("admin/pages/category-edit.pug", {
      pageTitle: "Chỉnh sửa danh mục",
      categoryList: categoryListTree,
      categoryDetail: categoryDetail
    })
  }
  catch (error) {
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
  catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
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
  catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.changeMulti = async (req, res) => {
  try {
    const { status, idList } = req.body;

    switch(status)
    {
      case "delete":
      {
        await Category.updateMany({
          _id: { $in: idList }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deleteAt: Date.now()
        })
        req.flash("success", "Xóa thành công!");
        break; 
      }
      case "active" : case "inactive" :
      {
        await Category.updateMany({
          _id: { $in: idList }
        }, {
          status: status,
          updatedBy: req.account.id,
          updatedAt: Date.now()
        })
        req.flash("success", "Áp dụng trạng thái thành công!");
        break;
      }
    }

    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}