const router = require('express').Router();

const accountRouter = require("./account.router");
const dashboardRouter = require("./dashboard.router");
const categoryRouter = require("./category.router");
const tourRouter = require("./tour.router");
const orderRouter = require("./order.router");
const userRouter = require("./user.router");
const contactRouter = require("./contact.router");
const settingRouter = require("./setting.router");
const profileRouter = require("./profile.router");

const authMiddleware = require("./../../middlewares/admin/auth.middleware");

// Không lưu giao diện vào cache để tránh sau khi đăng xuất vẫn quay lại trang đó
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
})

router.use('/account', accountRouter);
router.use('/dashboard', authMiddleware.verifyToken, dashboardRouter);
router.use('/category', authMiddleware.verifyToken, categoryRouter);
router.use('/tour', authMiddleware.verifyToken, tourRouter);
router.use('/order', authMiddleware.verifyToken, orderRouter);
router.use('/user', authMiddleware.verifyToken, userRouter);
router.use('/contact', authMiddleware.verifyToken, contactRouter);
router.use('/setting', authMiddleware.verifyToken, settingRouter);
router.use('/profile', authMiddleware.verifyToken, profileRouter);
router.get('*', (req, res) => {
  res.render("admin/pages/error-404.pug", {
    pageTitle: "404 Not Found"
  })
})

module.exports = router;