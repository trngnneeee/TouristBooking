const Cities = require("../../models/cities.model");
const Orders = require("../../models/order.model");
const Tours = require("../../models/tour.model");
const moment = require("moment");
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
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

    if (!orderDetail) {
      res.redirect("/");
      return;
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH/mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
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
  catch (error) {
    res.redirect("/");
  }
}

module.exports.zalopay = async (req, res) => {
  try {
    const id = req.query.orderID;

    const orderDetail = await Orders.findOne({
      _id: id,
      paymentStatus: "unpaid",
      deleted: false
    })

    const config = {
      app_id: process.env.ZALOPAY_APPID,
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2,
      endpoint: process.env.ZALOPAY_ENDPOINT
    };

    const embed_data = {
      redirecturl: `${process.env.NGROK_URL}/order/success?orderID=${id}&phone=${orderDetail.phone}`
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${orderDetail.id}-${orderDetail.phone}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Thanh toán đơn hàng - ${orderDetail.id}`,
      callback_url: `${process.env.NGROK_URL}/order/zalopay-result`
    };

    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order })
    if (response.data.return_code == 1) {
      res.redirect(response.data.order_url);
    }
    else res.redirect("/");
  }
  catch (error) {
    res.redirect(`/`);
  }
}

module.exports.zalopayResult = async (req, res) => {
  const config = {
    key2: process.env.ZALOPAY_KEY2
  };

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      const [orderId, phone] = dataJson.app_user.split("-");

      await Orders.updateOne({
        _id: orderId,
        phone: phone,
        deleted: false
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}