const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");
const cartRouter = require("./cart.route");
const contactRouter = require("./contact.route");
const categoryRouter = require("./category.route");

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

module.exports = router;