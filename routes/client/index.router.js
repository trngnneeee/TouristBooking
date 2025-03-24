const router = require('express').Router();

const routRouter = require("./tour.route");
const homeRouter = require("./home.router");

router.use('/tour', routRouter);
router.use('/', homeRouter);

module.exports = router;