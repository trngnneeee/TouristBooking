const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");
const cartRouter = require("./cart.route");
const contactRouter = require("./contact.route");
const categoryRouter = require("./category.route");
const searchRouter = require("./search.route");
const orderRouter = require("./order.route");

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
  settingMiddleware.websiteInfo, 
  cartRouter
);

router.use(
  '/contact',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  contactRouter
)

router.use(
  '/category',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  categoryRouter
)

router.use(
  '/search',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  searchRouter
)

router.use(
  '/order',
  categoryMiddleware.categoryList,
  settingMiddleware.websiteInfo,
  orderRouter
)

module.exports = router;