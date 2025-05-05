const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");
const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary

const profileController =  require("../../controllers/admin/profile.controller");

router.get('/edit', profileController.edit);

router.patch(
  '/edit', 
  upload.single('avatar'),
  profileController.editPatch);

router.get('/change-password', profileController.changePassword);

module.exports = router;