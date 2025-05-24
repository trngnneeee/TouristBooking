const router = require('express').Router();

const dashboardController =  require("../../controllers/admin/dashboard.controller");

router.get('/', dashboardController.dashboard);

router.post('/', dashboardController.dashboardPost);

module.exports = router;