const express = require('express')
const path = require('path');

// Thiết lập dotevn
require('dotenv').config()

const app = express()
const port = 3000

// Kết nối database
const database = require('./config/database.config');
database.connect();

// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")));

const clientRoutes = require("./routes/client/index.router");
app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})