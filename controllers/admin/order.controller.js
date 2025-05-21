const Orders = require("../../models/order.model")
const variableConfig = require("../../config/variable.config");
const moment = require("moment");
const Cities = require("../../models/cities.model");

module.exports.list = async (req, res) => {
  const orderList = await Orders.find({
    deleted: false
  });

  for (const order of orderList) {
    order.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod).label;
    order.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus).label;
    order.statusName = variableConfig.orderStatus.find(item => item.value == order.status).label;

    order.createdAtTimeFormat = moment(order.createdAt).format("HH:mm");
    order.createdAtDateFormat = moment(order.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/order-list.pug", {
    pageTitle: "Quản lý đơn hàng",
    orderList: orderList
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
    res.redirect(`/${pathAdmin}/order/list`);
  }
}