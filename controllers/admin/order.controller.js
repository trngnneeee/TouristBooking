const Orders = require("../../models/order.model")
const variableConfig = require("../../config/variable.config");
const moment = require("moment");
const Cities = require("../../models/cities.model");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

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

  if (req.query.paymentMethod) {
    find.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.paymentStatus) {
    find.paymentStatus = req.query.paymentStatus;
  }

  if (req.query.search) {
    const search = new RegExp(req.query.search);
    find.phone = search;
  }

  const limitItem = 3;
  const totalItem = await Orders.countDocuments({
    deleted: false
  })
  const totalPage = Math.ceil(totalItem / limitItem);

  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(req.query.page);
    if (tmp > 0)
      page = tmp;
  }

  if (totalPage != 0 && page > totalPage)
    page = totalPage;
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalItem: totalItem,
    totalPage: totalPage,
    skip: skip
  }

  const orderList = await Orders.find(find).limit(limitItem).skip(skip);

  for (const order of orderList) {
    order.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod).label;
    order.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus).label;
    order.statusName = variableConfig.orderStatus.find(item => item.value == order.status).label;

    order.createdAtTimeFormat = moment(order.createdAt).format("HH:mm");
    order.createdAtDateFormat = moment(order.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/order-list.pug", {
    pageTitle: "Quản lý đơn hàng",
    orderList: orderList,
    orderStatus: variableConfig.orderStatus,
    paymentMethod: variableConfig.paymentMethod,
    paymentStatus: variableConfig.paymentStatus,
    pagination: pagination
  })
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const orderDetail = await Orders.findOne({
      _id: id,
      deleted: false
    })

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("DD/MM/YYYY HH:mm A")

    for (const item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await Cities.findOne({
        _id: item.departure
      })
      item.departureName = city.name;
    }

    res.render("admin/pages/order-edit.pug", {
      pageTitle: `Đơn hàng: ${orderDetail.id}`,
      orderDetail: orderDetail,
      paymentMethod: variableConfig.paymentMethod,
      paymentStatus: variableConfig.paymentStatus,
      orderStatus: variableConfig.orderStatus
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/order/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.updatedAt = Date.now();
    req.body.updatedBy = req.account.id;

    await Orders.updateOne({
      _id: id
    }, req.body)

    req.flash("success", "Cập nhật thành công!");
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
    await Orders.updateOne({
      _id: id,
      deleted: false
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    })

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

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

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

  if (req.query.paymentMethod) {
    find.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.paymentStatus) {
    find.paymentStatus = req.query.paymentStatus;
  }

  if (req.query.search) {
    const search = new RegExp(req.query.search);
    find.phone = search;
  }

  const limitItem = 3;
  const totalItem = await Orders.countDocuments({
    deleted: true
  })
  const totalPage = Math.ceil(totalItem / limitItem);

  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(req.query.page);
    if (tmp > 0)
      page = tmp;
  }

  if (totalPage != 0 && page > totalPage)
    page = totalPage;
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalItem: totalItem,
    totalPage: totalPage,
    skip: skip
  }

  const orderList = await Orders.find(find).limit(limitItem).skip(skip);

  for (const order of orderList) {
    order.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod).label;
    order.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus).label;
    order.statusName = variableConfig.orderStatus.find(item => item.value == order.status).label;

    order.createdAtTimeFormat = moment(order.createdAt).format("HH:mm");
    order.createdAtDateFormat = moment(order.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/order-trash.pug", {
    pageTitle: "Thùng rác đơn hàng",
    orderList: orderList,
    orderStatus: variableConfig.orderStatus,
    paymentMethod: variableConfig.paymentMethod,
    paymentStatus: variableConfig.paymentStatus,
    pagination: pagination
  })
}

module.exports.trashApplyMultiPatch = async (req, res) => {
  switch (req.body.status) {
    case "recovery":
      {
        await Orders.updateMany({
          _id: { $in: req.body.idList }
        }, {
          updatedAt: Date.now(),
          updatedBy: req.account.id,
          deleted: false
        })
        req.flash("success", "Áp dụng thành công!");
        res.json({
          code: "success",
        })
        break;
      }
    case "hard-delete":
      {
        await Orders.deleteMany({
          _id: { $in: req.body.idList }
        })
        req.flash("success", "Xóa vĩnh viễn thành công!");
        res.json({
          code: "success",
        })
        break;
      }
  }
}

module.exports.hardDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await Orders.deleteOne({
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

module.exports.recoveryPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Orders.updateOne({
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

module.exports.applyMultiPatch = async (req, res) => {
  await Orders.updateMany({
    _id: { $in: req.body.idList }
  }, {
    deletedAt: Date.now(),
    deletedBy: req.account.id,
    deleted: true
  })
  req.flash("success", "Áp dụng thành công!");
  res.json({
    code: "success",
  })
}