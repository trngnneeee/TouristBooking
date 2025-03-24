const express = require('express')
const path = require('path');
// Thiết lập Mongoose + Kết nối với CSDL Online
// Thiết lập dotevn
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const app = express()
const port = 3000

// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")));

const homeController = require("./controllers/home.controller");
app.get('/', homeController.home);

const tourController =  require("./controllers/client/tour.controller");
app.get('/tour', tourController.list);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})