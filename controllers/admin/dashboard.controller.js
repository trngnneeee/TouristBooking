const AccountAdmin = require("../../models/account-admin.model")
const Orders = require("../../models/order.model")
const moment = require("moment");
const variableConfig = require("../../config/variable.config");

module.exports.dashboard = async (req, res) => {
  const overView = {
    userNum: 0,
    orderNum: 0,
    totalPrice: 0
  }

  overView.userNum = await AccountAdmin.countDocuments({
    deleted: false,
    status: "active"
  })

  const orderList = await Orders.find({
    deleted: false
  });
  overView.orderNum = orderList.length;

  for (const item of orderList) {
    overView.totalPrice += item.total;
  }

  const newOrderList = await Orders.find({
    deleted: false
  })
    .limit(5)

  for (const order of newOrderList) {
    order.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod).label;
    order.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus).label;
    order.statusName = variableConfig.orderStatus.find(item => item.value == order.status).label;

    order.createdAtTimeFormat = moment(order.createdAt).format("HH:mm");
    order.createdAtDateFormat = moment(order.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/dashboard.pug", {
    pageTitle: "Tổng quan",
    overView: overView,
    newOrderList: newOrderList
  })
}

module.exports.dashboardPost = async (req, res) => {
  const currentMonthOrderList = await Orders.find({
    deleted: false,
    createdAt: {
      $gte: new Date(req.body.currentYear, req.body.currentMonth - 1, 1),
      $lte: new Date(req.body.currentYear, req.body.currentMonth, 1),
    }
  }
)
  const previousMonthOrderList = await Orders.find({
    deleted: false,
    createdAt: {
      $gte: new Date(req.body.previousYear, req.body.previousMonth - 1, 1),
      $lte: new Date(req.body.previousYear, req.body.previousMonth, 1),
    }
  })

  const currentMonthData = [];
  const previousMonthData = [];
  for (const day of req.body.dayArray)
  {
    let totalPrice = 0;
    for (const order of currentMonthOrderList)
    {
      if (new Date(order.createdAt).getDate() == day)
      {
        totalPrice += order.total;
      }
    }
    currentMonthData[day - 1] = totalPrice;
  }
  for (const day of req.body.dayArray)
  {
    let totalPrice = 0;
    for (const order of previousMonthOrderList)
    {
      if (new Date(order.createdAt).getDate() == day)
      {
        totalPrice += order.total;
      }
    }
    previousMonthData[day - 1] = totalPrice;
  }



  res.json({
    code: "success",
    currentMonthData: currentMonthData,
    previousMonthData: previousMonthData
  })
}