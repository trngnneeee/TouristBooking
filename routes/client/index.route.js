const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");
const cartRouter = require("./cart.route");

router.use('/tours', tourRouter);
router.use('/', homeRouter);
router.use('/cart', cartRouter);

module.exports = router;