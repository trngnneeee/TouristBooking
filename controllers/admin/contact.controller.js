const Contact = require("../../models/contact.model")
const moment = require("moment");

module.exports.list = async (req, res) => {
  const contactList = await Contact.find({
    deleted: false
  })
  
  for (const item of contactList)
  {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/contact-list.pug", {
    pageTitle: "Thông tin liên hệ",
    contactList: contactList
  })
}
