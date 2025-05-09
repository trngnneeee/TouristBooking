const Category = require("../../models/category.model");

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

    if (category.parent)
    {
      const parentCategory = await Category.findOne({
        _id: category.parent,
        status: "active",
        deleted: false
      })
      if (parentCategory)
      {
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

    res.render("client/pages/tours.pug", {
      pageTitle: "Danh sách tour",
      data: data
    })
  }
  else
  {
    res.redirect("/");
  }

}