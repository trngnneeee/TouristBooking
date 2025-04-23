const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String
})

const Cities = mongoose.model('Cities', schema, "cities");

module.exports = Cities;