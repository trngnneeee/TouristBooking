const Voucher = require("../../models/voucher.model")

module.exports.checkPost = async (req, res) => {
  const existVoucher = await Voucher.findOne({
    deleted: false,
    status: "active",
    name: req.body.coupon
  })
  if (!existVoucher) {
    res.json({
      code: "error",
      message: "Mã khuyến mãi không tồn tại!"
    });
    return;
  }
  else if (Date.now() > existVoucher.expire)
  {
    res.json({
      code: "error",
      message: "Mã khuyến mãi đã hết hạn!"
    });
    return;
  }

  const data = {};
  data.name = existVoucher.name;
  data.percentage = existVoucher.percentage;
  data.maxDiscount = existVoucher.maxDiscount;
  res.json({
    code: "success",
    coupon: data
  });
}