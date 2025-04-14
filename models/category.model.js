const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    status: String,
    avatar: String,
    description: String,
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

const Category = mongoose.model('Category', schema, "categories");

module.exports = Category;