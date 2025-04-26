const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");

const tourController =  require("../../controllers/admin/tour.controller");
const tourValidate = require("../../validates/admin/tour.validate");

router.get('/list', tourController.list);

router.get('/create', tourController.create);

const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary
router.post(
  '/create', 
  upload.single('avatar'),
  tourValidate.createPost,
  tourController.createPost
);

router.get('/edit/:id', tourController.edit);
router.patch(
    '/edit/:id', 
    upload.single('avatar'),
    tourValidate.createPost,
    tourController.editPatch
);

router.patch('/delete/:id', tourController.delete);

router.get('/trash', tourController.trash);

router.patch('/recovery/:id', tourController.recovery);

router.delete('/hard-delete/:id', tourController.hardDelete);

module.exports = router;