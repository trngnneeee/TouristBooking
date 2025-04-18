const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form

const categoryValidate = require("../../validates/admin/category.validate");
const categoryController =  require("../../controllers/admin/category.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");

router.get('/list', categoryController.list);

router.get('/create', categoryController.create);
const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary
router.post(
    '/create', 
    upload.single('avatar'),
    categoryValidate.createPost,
    categoryController.createPost
);

router.get('/edit/:id', categoryController.edit);
router.patch(
    '/edit/:id', 
    upload.single('avatar'),
    categoryValidate.createPost,
    categoryController.editPatch
);

router.patch('/delete/:id', categoryController.delete);

module.exports = router;