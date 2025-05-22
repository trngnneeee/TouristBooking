const router = require('express').Router();

const orderController =  require("../../controllers/admin/order.controller");

router.get('/list', orderController.list);

router.get('/edit/:id', orderController.edit);

router.patch('/edit/:id', orderController.editPatch)

router.patch('/delete/:id', orderController.deletePatch);

router.get('/trash', orderController.trash);

router.patch('/apply-multi', orderController.applyMultiPatch)

router.delete('/hard-delete/:id', orderController.hardDelete);

router.patch('/recovery/:id', orderController.recoveryPatch);

module.exports = router;