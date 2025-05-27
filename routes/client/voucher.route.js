const router = require('express').Router();

const voucherController =  require("../../controllers/client/voucher.controller");

router.post('/check', voucherController.checkPost);

module.exports = router;