const router = require('express').Router();
const multer = require('multer'); // Thư viện Multer để gửi ảnh trực tiếp từ FE qua BE thông qua form
const cloudinaryHelper = require("../../helpers/cloudinary.helpers");

const upload = multer({ storage: cloudinaryHelper.storage }); // Khi chạy vào hàm của Lib Multer, ta cho nó chạy vào cloudinary để up ảnh lên Cloudinary

const settingController = require("../../controllers/admin/setting.controller");
const settingValidate = require("../../validates/admin/setting.validate");

router.get(
  '/list',
  settingController.list
);

/* Website Information */
router.get(
  '/website-info',
  settingController.websiteInfo
);

router.patch(
  '/website-info',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]),
  settingValidate.websiteInfoPatch,
  settingController.websiteInfoPatch
);

/* Admin Account */
router.get(
  '/account-admin/list',
  settingController.accountAdminList
);

router.post(
  '/account-admin/create',
  upload.single('avatar'),
  settingValidate.accountAdminCreatePost,
  settingController.accountAdminCreatePost
);

router.get(
  '/account-admin/create',
  settingController.accountAdminCreate
);

router.get(
  '/account-admin/edit/:id',
  settingController.accountAdminEdit
);

router.patch(
  '/account-admin/edit/:id',
  upload.single('avatar'),
  settingValidate.accountAdminEditPatch,
  settingController.accountAdminEditPatch
);

router.patch(
  '/account-admin/multi-apply',
  settingController.accountAdminMultiApply
)

router.patch(
  '/account-admin/delete/:id',
  settingController.accountAdminDelete
)

router.get(
  '/account-admin/trash',
  settingController.accountAdminTrash
)

router.patch(
  '/account-admin/trash/multi-apply',
  settingController.accountAdminTrashMultiApplyPatch
)

router.delete(
  '/account-admin/trash/multi-apply',
  settingController.accountAdminTrashMultiApplyDelete
)

router.patch(
  '/account-admin/recovery/:id',
  settingController.accountAdminRecovery
)

router.delete(
  '/account-admin/hard-delete/:id',
  settingController.accountAdminHardDelete
)

/* Role */
router.get(
  '/role/list',
  settingController.roleList
);

router.get(
  '/role/create',
  settingController.roleCreate
);

router.post(
  '/role/create',
  settingValidate.roleCreatePost,
  settingController.roleCreatePost
);

router.get(
  '/role/edit/:id',
  settingController.roleEdit
);

router.patch(
  '/role/edit/:id',
  settingValidate.roleCreatePost,
  settingController.roleEditPatch
);

router.delete(
  '/role/apply-multi',
  settingController.roleApplyMulti
)

router.delete(
  '/role/delete/:id',
  settingController.roleDelete
)

module.exports = router;