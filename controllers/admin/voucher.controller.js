const Voucher = require("../../models/voucher.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.expire = dateFilter;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    find.name = searchRegex;
  }

  const limitItem = 3;
  const totalRecord = await Voucher.countDocuments({
    deleted: false
  });
  const totalPage = Math.ceil(totalRecord / limitItem);
  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(req.query.page);
    if (tmp > 0) page = tmp;
  }
  if (totalRecord != 0 && page > totalPage) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItem;
  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    skip: skip
  }

  const voucherList = await Voucher.find(find).limit(limitItem).skip(skip);

  for (const item of voucherList) {
    item.expireFormat = moment(item.expire).format("DD/MM/YYYY");
  }

  res.render("admin/pages/voucher-list.pug", {
    pageTitle: "Quản lý Voucher",
    voucherList: voucherList,
    pagination: pagination
  })
}

module.exports.create = (req, res) => {
  res.render("admin/pages/voucher-create.pug", {
    pageTitle: "Tạo Voucher"
  })
}

module.exports.createPost = async (req, res) => {
  const existVoucher = await Voucher.findOne({
    name: req.body.name
  });
  if (existVoucher) {
    res.json({
      code: "error",
      message: "Mã voucher đã tồn tại!"
    });
    return;
  }

  req.body.expire = req.body.expire ? new Date(req.body.expire) : null;

  req.body.createdBy = req.account.id;

  const newRecord = new Voucher(req.body);
  await newRecord.save();

  req.flash("success", "Tạo voucher thành công!");
  res.json({
    code: "success"
  })
}

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.expire = dateFilter;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    find.name = searchRegex;
  }

  const limitItem = 3;
  const totalRecord = await Voucher.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(req.query.page);
    if (tmp > 0) page = tmp;
  }
  if (totalRecord != 0 && page > totalPage) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItem;
  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    skip: skip
  }

  const voucherList = await Voucher.find(find).limit(limitItem).skip(skip);

  for (const item of voucherList) {
    item.expireFormat = moment(item.expire).format("DD/MM/YYYY");
  }

  res.render("admin/pages/voucher-trash.pug", {
    pageTitle: "Quản lý Voucher",
    voucherList: voucherList,
    pagination: pagination
  })
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const voucherDetail = await Voucher.findOne({
      _id: id,
      deleted: false
    })

    voucherDetail.expireFormat = moment(voucherDetail.expire).format("YYYY-MM-DD");

    res.render("admin/pages/voucher-edit.pug", {
      pageTitle: "Chỉnh sửa Voucher",
      voucherDetail: voucherDetail
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.expire = new Date(req.body.expire);

    await Voucher.updateOne({
      _id: id,
      deleted: false
    }, {
      $set: {
        ...req.body,
        updatedBy: req.account.id,
        updatedAt: Date.now()
      }
    });

    req.flash("success", "Chỉnh sửa thành công!");
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

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Voucher.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    req.flash("success", "Xóa thành công!");
    res.json({
      code: "success"
    });
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ!"
    })
  }
}

module.exports.applyMultiPatch = async (req, res) => {
  const { status, idList } = req.body;

  switch (status) {
    case "delete":
      {
        await Voucher.updateMany({
          _id: { $in: idList },
          deleted: false
        }, {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account.id
        })
        req.flash("success", "Xoá thành công!");
        res.json({
          code: "success"
        })
        break;
      }
    case "active": case "inactive":
      {
        await Voucher.updateMany({
          _id: { $in: idList },
          deleted: false
        }, {
          status: status,
          updatedAt: Date.now(),
          updatedBy: req.account.id
        })
        req.flash("success", "Áp dụng thành công!");
        res.json({
          code: "success"
        })
        break;
      }
  }
}

module.exports.trashApplyMultiPatch = async (req, res) => {
  const { status, idList } = req.body;

  await Voucher.updateMany({
    _id: { $in: idList },
    deleted: true
  }, {
    deleted: false,
    updatedAt: Date.now(),
    updatedBy: req.account.id
  });

  req.flash("success", "Áp dụng thành công!");
  res.json({
    code: "success"
  })
}

module.exports.trashApplyMultiDelete = async (req, res) => {
  const { status, idList } = req.body;

  await Voucher.deleteMany({
    _id: { $in: idList },
    deleted: true
  });

  req.flash("success", "Xóa thành công!");
  res.json({
    code: "success"
  })
}

module.exports.recoveryPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Voucher.updateOne({
      _id: id
    }, {
      deleted: false,
      updatedAt: Date.now(),
      updatedBy: req.account.id
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
    const id = req.params.id;
    
    await Voucher.deleteOne({
      _id: id
    });

    req.flash("success", "Xóa thành công!");
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