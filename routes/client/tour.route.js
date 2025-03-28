const router = require('express').Router();

const tourController =  require("./../../controllers/client/tour.controller");
router.get('/', tourController.list);
router.get('/tour-detail', tourController.detail);

module.exports = router;