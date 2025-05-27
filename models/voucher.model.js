const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: String,
    percentage: Number,
    maxDiscount: Number,
    status: String,
    expire: Date,
    createdBy: String,
    updatedBy: String,
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

const Voucher = mongoose.model('Voucher', schema, "vouchers");

module.exports = Voucher;