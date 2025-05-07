const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");
const cartRouter = require("./cart.route");

const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

router.use(
  '/tours',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  tourRouter
);

router.use(
  '/',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  homeRouter
);

router.use(
  '/cart',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo, cartRouter
);

module.exports = router;