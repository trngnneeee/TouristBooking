const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  role: String,
  positionCompany: String,
  status: String,
  password: String,
  avatar: String,
  createdBy: String,
  updatedBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: Date,
  slug: {
    type: String,
    slug: "fullName", // Dựa vào name: String để tạo ra slug
    unique: true
  },
},
  {
    timestamps: true
  }
)

const AccountAdmin = mongoose.model('AccountAdmin', schema, "account-admin");

module.exports = AccountAdmin;