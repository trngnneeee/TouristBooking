const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");

const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary

const settingController =  require("../../controllers/admin/setting.controller");
const settingValidate = require("../../validates/admin/setting.validate");

router.get('/list', settingController.list);
router.get('/website-info', settingController.websiteInfo);
router.patch(
  '/website-info', 
  upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'favicon', maxCount: 1 }
  ]),
  settingValidate.websiteInfoPatch,
  settingController.websiteInfoPatch
);
router.get('/account-admin/list', settingController.accountAdminList);
router.get('/account-admin/create', settingController.accountAdminCreate);
router.get('/role/list', settingController.roleList);

router.get('/role/create', settingController.roleCreate);
router.post(
  '/role/create',
  settingValidate.roleCreatePost, 
  settingController.roleCreatePost
);
router.get('/role/edit/:id', settingController.roleEdit);
router.patch(
  '/role/edit/:id', 
  settingValidate.roleCreatePost,
  settingController.roleEditPatch
);

module.exports = router;