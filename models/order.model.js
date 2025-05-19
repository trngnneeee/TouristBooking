const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  fullName: String,
  phone: String,
  note: String,
  items: Array,
  subTotal: Number,
  discount: Number,
  total: Number,
  paymentStatus: String,
  paymentMethod: String,
  status: String,
  updatedBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: String
}, {
  timestamps: true
})

const Orders = mongoose.model('Orders', schema, "orders");

module.exports = Orders;