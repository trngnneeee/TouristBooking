const router = require('express').Router();

const tourRouter = require("./tour.route");
const homeRouter = require("./home.router");
const cartRouter = require("./cart.router");

router.use('/tours', tourRouter);
router.use('/', homeRouter);
router.use('/cart', cartRouter);

module.exports = router;