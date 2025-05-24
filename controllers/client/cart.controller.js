const Cities = require("../../models/cities.model");
const Tours = require("../../models/tour.model");
const moment = require("moment");
const variableConfig = require("../../config/variable.config");

module.exports.cart = (req, res) => {
  res.render("client/pages/cart.pug", {
    pageTitle: "Giỏ hàng",
    paymentMethod: variableConfig.paymentMethod
  })
}

module.exports.cartPost = async (req, res) => {
  const { cart } = req.body;
  
  for (const item of cart)
  {
    const cartItem = await Tours.findOne({
      deleted: false,
      status: "active",
      _id: item.tourID
    })
    if (cartItem)
    {
      item.avatar = cartItem.avatar;
      item.name = cartItem.name;
      item.slug = cartItem.slug;
      item.departureDateFormat = moment(cartItem.departureDate).format("DD/MM/YYYY");
      item.priceNewAdult = cartItem.priceNewAdult;
      item.priceNewChildren = cartItem.priceNewChildren;
      item.priceNewBaby = cartItem.priceNewBaby;
      item.position = cartItem.position;
      const city = await Cities.findOne({
        _id: item.departure
      });
      if (city) item.departureName = city.name;
    }
    else
    {
      const indexItem = cart.findIndex(tour => tour.tourID = item.tourID);
      cart.splice(indexItem, 1);
    }
  }

  res.json({
    code: "success",
    cart: cart
  });
}