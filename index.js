const express = require('express')
const path = require('path');
// Thiết lập Mongoose + Kết nối với CSDL Online
// Thiết lập dotevn
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const Tour = mongoose.model('Tour', { 
  name: String,
  vehicle: String
}, "tours");

const app = express()
const port = 3000

// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render("client/pages/home.pug", {
    pageTitle: "Trang chủ"
  })
})

app.get('/tour', async (req, res) => {
  const tourList = await Tour.find({});
  
  res.render("client/pages/tour-list.pug", {
    pageTitle: "Danh sách tour",
    tourList: tourList
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})