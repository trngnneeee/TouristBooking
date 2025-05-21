const AccountAdmin = require("../../models/account-admin.model")
const Orders = require("../../models/order.model")

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

  for (const item of orderList)
  {
    overView.totalPrice += item.total;
  }
  
  res.render("admin/pages/dashboard.pug", {
    pageTitle: "Tổng quan",
    overView: overView
  })
}