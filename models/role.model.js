const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({
  name: String,
  description: String,
  permissions: Array,
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
    slug: "name", // Dựa vào name: String để tạo ra slug
    unique: true
  },
}, 
  {
    timestamps: true
  }
)

const Role = mongoose.model('Role', schema, "role");

module.exports = Role;