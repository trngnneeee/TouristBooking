const { buildCategoryTree } = require("../../helpers/category.helpers");
const Category = require("../../models/category.model");

module.exports.categoryList = async (req, res, next) => {
  const categoryList = await Category.find({
    deleted: false,
    status: "active"
  })

  const categoryListTree = buildCategoryTree(categoryList);

  res.locals.categoryList = categoryListTree;

  next();
}