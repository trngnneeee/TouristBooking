const Contact = require("../../models/contact.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).startOf("date").toDate();
    dateFilter.$lte = endDate;
  }

  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search);
    find.email = searchRegex;
  }

  const limitItem = 5;
  const totalItem = await Contact.countDocuments({
    deleted: false
  });
  const totalPage = Math.ceil(totalItem / limitItem);

  let page = 1;
  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (currentPage > 0)
      page = currentPage;
  }

  if (page > totalPage && totalPage != 0)
    page = totalPage;

  const skip = (page - 1) * limitItem;

  const pagination = {
    totalItem: totalItem,
    totalPage: totalPage,
    skip: skip
  }

  const contactList = await Contact.find(find).limit(limitItem).skip(skip);

  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/contact-list.pug", {
    pageTitle: "Thông tin liên hệ",
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.multiApply = async (req, res) => {
  const { status, idList } = req.body;

  if (!req.permissions.includes("contact-delete")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  await Contact.updateMany({
    _id: { $in: idList }
  }, {
    deleted: true
  })

  req.flash("success", "Áp dụng thành công!")
  res.json({
    code: "success"
  })
}

module.exports.detetePatch = async (req, res) => {
  try {
    if (!req.permissions.includes("contact-delete")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }

    const id = req.params.id;

    await Contact.updateOne({
      _id: id
    }, {
      deleted: true
    })

    req.flash("success", "Xóa liên hệ thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  };

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search);
    find.email = searchRegex;
  }

  const limitItem = 5;
  const totalItem = await Contact.countDocuments({
    deleted: false
  });
  const totalPage = Math.ceil(totalItem / limitItem);

  let page = 1;
  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (currentPage > 0)
      page = currentPage;
  }

  if (page > totalPage && totalPage != 0)
    page = totalPage;

  const skip = (page - 1) * limitItem;

  const pagination = {
    totalItem: totalItem,
    totalPage: totalPage,
    skip: skip
  }

  const contactList = await Contact.find(find);

  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/contact-trash.pug", {
    pageTitle: "Thùng rác thông tin liên hệ",
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.trashMultiApply = async (req, res) => {
  const { status, idList } = req.body;

  if (!req.permissions.includes("contact-trash")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  switch (status) {
    case "hard-delete":
      {
        await Contact.deleteMany({
          _id: { $in: idList }
        })
        req.flash("success", "Xóa vĩnh viễn thành công!");
        res.json({
          code: "success"
        })
        break;
      }
    case "recovery":
      {
        await Contact.updateMany({
          _id: idList
        }, {
          deleted: false
        });
        req.flash("success", "Khôi phục thành công!");
        res.json({
          code: "success"
        })
        break;
      }
  }
}

module.exports.recovery = async (req, res) => {
  try {
    if (!req.permissions.includes("contact-trash")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }

    const id = req.params.id;

    await Contact.updateOne({
      _id: id
    }, {
      deleted: false
    })

    req.flash("success", "Khôi phục thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.hardDelete = async (req, res) => {
  try {
    if (!req.permissions.includes("contact-trash")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }

    const id = req.params.id;

    await Contact.deleteOne({
      _id: id
    })

    req.flash("success", "Xóa vĩnh viễn thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}