const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

const schema = new mongoose.Schema({
  name: String,
  category: String,
  position: Number,
  status: String,
  avatar: String,
  priceAdult: Number,
  priceChildren: Number,
  priceBaby: Number,
  priceNewAdult: Number,
  priceNewChildren: Number,
  priceNewBaby: Number,
  stockAdult: Number,
  stockChildren: Number,
  stockBaby: Number,
  locations: Array,
  time: String,
  vehicle: String,
  departureDate: Date,
  information: String,
  schedules: Array,
  // Các thông tin thêm
  createdBy: String,
  updatedBy: String,
  slug: {
    type: String,
    slug: "name", // Dựa vào name: String để tạo ra slug
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: Date
  }, 
  {
    timestamps: true
  }
)

const Tours = mongoose.model('Tours', schema, "tours");

module.exports = Tours;