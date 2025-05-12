const Tours = require("../../models/tour.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
    status: "active"
  };
  
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