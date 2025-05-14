const router = require('express').Router();

const accountRouter = require("./account.route");
const dashboardRouter = require("./dashboard.route");
const categoryRouter = require("./category.route");
const tourRouter = require("./tour.route");
const orderRouter = require("./order.route");
const userRouter = require("./user.route");
const contactRouter = require("./contact.route");
const settingRouter = require("./setting.route");
const profileRouter = require("./profile.route");
const uploadRouter = require("./upload.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

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
router.use('/upload', authMiddleware.verifyToken, uploadRouter);
router.get('*', (req, res) => {
  res.render("admin/pages/error-404.pug", {
    pageTitle: "404 Not Found"
  })
})

module.exports = router;