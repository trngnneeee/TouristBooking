const router = require('express').Router();

const contactController =  require("../../controllers/admin/contact.controller");

router.get('/list', contactController.list);

router.patch('/multi-apply', contactController.multiApply);

router.patch('/delete/:id', contactController.detetePatch);

module.exports = router;