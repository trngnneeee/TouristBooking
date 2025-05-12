const Tours = require("../../models/tour.model")
const moment = require("moment");
const slugify = require('slugify');

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
    status: "active"
  };

  if (req.query.departure) {
    find.locations = req.query.departure;
  }

  if (req.query.destination) {
    const search = slugify(req.query.destination, {
      lower: true,
      locale: "vi"
    });
    const searchRegex = new RegExp(search);
    find.slug = searchRegex;
  }

  if (req.query.departureDate)
  {
    find.departureDate = new Date(req.query.departureDate);
  }

  if (req.query.stockAdult)
  {
    const stockAdult = parseInt(req.query.stockAdult);
    if (stockAdult > 0)
      find.stockAdult = {
        $gte: stockAdult
    };
  }
  if (req.query.stockChildren)
  {
    const stockChildren = parseInt(req.query.stockChildren);
    if (stockChildren > 0)
      find.stockChildren = {
        $gte: stockChildren
    };
  }
  if (req.query.stockBaby)
  {
    const stockBaby = parseInt(req.query.stockBaby);
    if (stockBaby > 0)
      find.stockBaby = {
        $gte: stockBaby
    };
  }

  if (req.query.price)
  {
    const [priceMin, priceMax] = req.query.price.split("-").map(item => parseInt(item));
    find.priceNewAdult = {
      $gte: priceMin,
      $lte: priceMax
    }
  }

  const tourList = await Tours.find(find);

  for (const item of tourList) {
    if (item.departureDate) {
      const departureDate = moment(item.departureDate).format("DD/MM/YYYY");
      item.departureDateFormat = departureDate;
    }
  }

  res.render("client/pages/search.pug", {
    pageTitle: "Kết quả tìm kiếm",
    tourList: tourList
  })
}