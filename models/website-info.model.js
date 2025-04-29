const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  websiteName: String,
  phone: String,
  email: String,
  address: String,
  logo: String,
  favicon: String
})

const WebsiteInformation = mongoose.model('WebsiteInformation', schema, "website-info");

module.exports = WebsiteInformation;