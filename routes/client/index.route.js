const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");
const cartRouter = require("./cart.route");

const settingMiddleware = require("../../middlewares/client/setting.middleware");

router.use('/tours', settingMiddleware.websiteInfo, tourRouter);
router.use('/', settingMiddleware.websiteInfo, homeRouter);
router.use('/cart', settingMiddleware.websiteInfo, cartRouter);

module.exports = router;