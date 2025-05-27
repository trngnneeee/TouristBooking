const router = require('express').Router();

const voucherController =  require("../../controllers/admin/voucher.controller");

router.get('/list', voucherController.list);

router.get('/create', voucherController.create);

router.post('/create', voucherController.createPost);

router.get('/trash', voucherController.trash);

router.get('/edit/:id', voucherController.edit);

router.patch('/edit/:id', voucherController.editPatch);

router.patch('/delete/:id', voucherController.deletePatch);

router.patch('/apply-multi', voucherController.applyMultiPatch);

router.patch('/trash/apply-multi', voucherController.trashApplyMultiPatch);

router.delete('/trash/apply-multi', voucherController.trashApplyMultiDelete);

router.patch('/trash/recovery/:id', voucherController.recoveryPatch);

router.delete('/trash/hard-delete/:id', voucherController.hardDelete);

module.exports = router;