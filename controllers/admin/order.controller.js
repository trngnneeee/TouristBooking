const Orders = require("../../models/order.model")
const variableConfig = require("../../config/variable.config");
const moment = require("moment");

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

module.exports.edit = (req, res) => {
  res.render("admin/pages/order-edit.pug", {
    pageTitle: "Đơn hàng: OD000001"
  })
}