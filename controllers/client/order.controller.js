const Orders = require("../../models/order.model");
const Tours = require("../../models/tour.model");

module.exports.createPost = async (req, res) => {
  try {
    let subTotal = 0;
    for (const item of req.body.items) {
      const tourDetail = await Tours.findOne({
        _id: item.tourID,
        status: "active",
        deleted: false
      })
      if (tourDetail.stockAdult < item.quantityAdult || tourDetail.stockChildren < item.quantityChildren || tourDetail.stockBaby < item.quantityBaby)
      {
        res.json({
          code: "error",
          message: `Số lượng chỗ của ${tourDetail.name} đã hết!`
        });
        return;
      }
      if (tourDetail)
      {
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