const express = require('express')
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');

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

// Tạo biến toàn cục trong file PUG
const variableConfig = require("./config/variable.config");
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục
global.pathAdmin = variableConfig.pathAdmin;

// Cho phép FE gửi data lên dạng JSON
app.use(express.json());
app.use(cookieParser('ABCDEF123'));
// Nhúng thư viện flash
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const adminRoutes = require("./routes/admin/index.route");
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);

const clientRoutes = require("./routes/client/index.route");
app.use("/", clientRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})