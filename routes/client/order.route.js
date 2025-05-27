const router = require('express').Router();

const orderController =  require("../../controllers/client/order.controller");

router.post('/create', orderController.createPost);

router.get('/success', orderController.success);
router.get('/fail', orderController.fail);

router.get('/zalopay', orderController.zalopay);

router.post('/zalopay-result', orderController.zalopayResult);

router.get('/vnpay', orderController.vnpay);

router.get('/vnpay-result', orderController.vnpayResult);

module.exports = router;