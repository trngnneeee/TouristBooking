const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");
const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary

const profileController =  require("../../controllers/admin/profile.controller");
const profileValidate = require("../../validates/admin/profile.validate");

router.get('/edit', profileController.edit);

router.patch(
  '/edit', 
  upload.single('avatar'),
  profileValidate.editPatch,
  profileController.editPatch);

router.get('/change-password', profileController.changePassword);
router.patch(
  '/change-password', 
  profileValidate.changePasswordPatch,
  profileController.changePasswordPatch
);

module.exports = router;