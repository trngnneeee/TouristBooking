const { buildCategoryTree } = require("../../helpers/category.helpers")
const Category = require("../../models/category.model")

module.exports.list = (req, res) => {
  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục"
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
  if (req.body.position)
  {
    req.body.position = parseInt(req.body.position);
  }
  else
  {
    // Đếm số bản ghi trong CSDL
    const totalRecord = await Category.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.createBy = req.account.id;
  req.body.updateBy = req.account.id;

  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Category(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo danh mục thành công!"
  })
}