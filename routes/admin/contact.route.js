const router = require('express').Router();

const contactController =  require("../../controllers/admin/contact.controller");

router.get('/list', contactController.list);

router.patch('/multi-apply', contactController.multiApply);

router.patch('/delete/:id', contactController.detetePatch);

router.get('/trash', contactController.trash);

router.patch('/trash/multi-apply', contactController.trashMultiApply);

router.patch('/recovery/:id', contactController.recovery);

router.delete('/hard-delete/:id', contactController.hardDelete);

module.exports = router;