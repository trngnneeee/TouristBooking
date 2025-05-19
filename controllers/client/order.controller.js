const Cities = require("../../models/cities.model");
const Orders = require("../../models/order.model");
const Tours = require("../../models/tour.model");
const moment = require("moment");
const { paymentMethod } = require("../../config/variable.config");

module.exports.createPost = async (req, res) => {
  try {
    let subTotal = 0;
    for (const item of req.body.items) {
      const tourDetail = await Tours.findOne({
        _id: item.tourID,
        status: "active",
        deleted: false
      })
      if (tourDetail.stockAdult < item.quantityAdult || tourDetail.stockChildren < item.quantityChildren || tourDetail.stockBaby < item.quantityBaby) {
        res.json({
          code: "error",
          message: `Số lượng chỗ của ${tourDetail.name} đã hết!`
        });
        return;
      }
      if (tourDetail) {
        item.priceNewAdult = tourDetail.priceNewAdult;
        item.priceNewChildren = tourDetail.priceNewChildren;
        item.priceNewBaby = tourDetail.priceNewBaby;

        item.departureDate = tourDetail.departureDate;

        item.avatar = tourDetail.avatar;

        item.name = tourDetail.name;

        subTotal += item.quantityAdult * item.priceNewAdult + item.quantityChildren * item.priceNewChildren + item.quantityBaby * item.priceNewBaby;

        // Cập nhật lại số lượng còn lại của Tour
        await Tours.updateOne({
          _id: item.tourID,
          status: "active",
          deleted: false
        }, {
          stockAdult: tourDetail.stockAdult - item.quantityAdult,
          stockChildren: tourDetail.stockChildren - item.quantityChildren,
          stockBaby: tourDetail.stockBaby - item.quantityBaby,
        })
      }
    }

    // Tổng tiền thanh toán
    req.body.subTotal = subTotal;
    req.body.discount = 0;
    req.body.total = req.body.subTotal - req.body.discount;

    // Tình trạng thanh toán
    req.body.paymentStatus = "unpaid";

    // Trạng thái đơn hàng
    req.body.status = "initial"; /* initial: khởi tạo, done: hoàn thành, cancel: hủy */

    const newRecord = new Orders(req.body);
    await newRecord.save();

    req.flash("success", "Đặt tour thành công!");
    res.json({
      code: "success",
      orderID: newRecord.id
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Đặt hàng không thành công!"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    const { orderID, phone } = req.query;

    const orderDetail = await Orders.findOne({
      _id: orderID,
      phone: phone
    })

    if (!orderDetail)
    {
      res.redirect("/");
      return;
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH/mm - DD/MM/YYYY");

    for (const item of orderDetail.items)
    {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await Cities.findOne({
        _id: item.departure
      })
      item.departureName = city.name;
    }

    orderDetail.paymentMethodName = paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;

    res.render("client/pages/order-success.pug", {
      pageTitle: "Đặt tour thành công!",
      orderDetail: orderDetail
    })
  }
  catch(error)
  {
    res.redirect("/");
  }
}