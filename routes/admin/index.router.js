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

router.use('/account', accountRouter);
router.use('/dashboard', dashboardRouter);
router.use('/category', categoryRouter);
router.use('/tour', tourRouter);
router.use('/order', orderRouter);
router.use('/user', userRouter);
router.use('/contact', contactRouter);
router.use('/setting', settingRouter);
router.use('/profile', profileRouter);
router.get('*', (req, res) => {
  res.render("admin/pages/error-404.pug", {
    pageTitle: "404 Not Found"
  })
})

module.exports = router;