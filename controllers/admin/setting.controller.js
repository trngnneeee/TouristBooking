const WebsiteInformation = require("../../models/website-info.model")
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");
const permissionList = require("../../config/permission-list.config");
const slugify = require('slugify');
const bcrypt = require("bcryptjs");
const moment = require("moment");

module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list.pug", {
    pageTitle: "Cài đặt chung"
  })
}

module.exports.websiteInfo = async (req, res) => {
  const websiteInfo = await WebsiteInformation.findOne({});

  res.render("admin/pages/setting-website-info.pug", {
    pageTitle: "Thông tin website",
    websiteInfo: websiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if (!req.permissions.includes("setting-website-info")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  if (req.files && req.files.logo)
    req.body.logo = req.files.logo[0].path;
  else delete req.body.logo;

  if (req.files && req.files.favicon)
    req.body.favicon = req.files.favicon[0].path;
  else delete req.body.favicon;

  const websiteInfo = await WebsiteInformation.findOne({});
  if (websiteInfo) {
    await websiteInfo.updateOne(req.body);
  }
  else {
    const newRecord = new WebsiteInformation(req.body);
    await newRecord.save();
  }

  req.flash("success", "Đổi thông tin website thành công!");
  res.json({
    code: "success"
  })
}

module.exports.accountAdminList = async (req, res) => {
  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.role) {
    find.role = req.query.role;
  }

  if (req.query.search) {
    const search = slugify(req.query.search, {
      lower: true,
      locale: "vi"
    });
    const searchRegex = new RegExp(search);
    find.slug = searchRegex;
  }

  const limitItem = 3;
  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  let page = 1;
  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (currentPage > 0)
      page = currentPage
  }
  if (page > totalPage && totalPage != 0)
    page = totalPage

  const skip = (page - 1) * limitItem;

  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    skip: skip
  }

  const adminAccountList = await AccountAdmin.find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItem)
    .skip(skip);

  for (const item of adminAccountList) {
    if (item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      })
      item.roleInfo = roleInfo.name;
    }
  }

  const roleList = await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị",
    adminAccountList: adminAccountList,
    roleList: roleList,
    pagination: pagination
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  if (!req.permissions.includes("setting-admin-account")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  })
  if (existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  req.body.avatar = req.file ? req.file.path : "";

  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(req.body.password, salt);

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;

  const newRecord = new AccountAdmin(req.body);
  await newRecord.save();

  req.flash("success", "Tạo tài khoản quản trị thành công!");
  res.json({
    code: "success"
  });
}

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList
  })
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const detailAccount = await AccountAdmin.findOne({
      _id: id
    })

    if (detailAccount.role) {
      const roleInfo = await Role.findOne({
        _id: detailAccount.role
      })
      detailAccount.roleInfo = roleInfo.name;
    }

    const roleList = await Role.find({
      deleted: false
    })

    res.render("admin/pages/setting-account-admin-edit.pug", {
      pageTitle: "Chỉnh sửa tài khoản quản trị",
      roleList: roleList,
      detailAccount: detailAccount
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-admin-account")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }

    const id = req.params.id;

    req.body.updatedBy = req.account.id;
    if (req.file)
      req.body.avatar = req.file.path;
    else
      delete req.body.avatar;

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    else delete req.body.password;

    await AccountAdmin.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Chỉnh sửa tài khoản quản trị thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminMultiApply = async (req, res) => {
  if (!req.permissions.includes("setting-admin-account")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  const { status, idList } = req.body;

  switch (status) {
    case "active": case "inactive":
      {
        await AccountAdmin.updateMany({
          _id: { $in: idList }
        }, {
          status: status,
          updatedAt: Date.now(),
          updatedBy: req.account.id
        })
        req.flash("success", "Áp dụng thành công!");
        res.json({
          code: "success"
        })
        break;
      }
    case "delete":
      {
        await AccountAdmin.updateMany({
          _id: { $in: idList }
        }, {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account.id
        })
        req.flash("success", "Xóa thành công!");
        res.json({
          code: "success"
        })
        break;
      }
  }
}

module.exports.accountAdminDelete = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-admin-account")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }
    const id = req.params.id;
    await AccountAdmin.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    req.flash("success", "Xóa thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}

module.exports.accountAdminTrash = async (req, res) => {
  const find = {
    deleted: true
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.role) {
    find.role = req.query.role;
  }

  if (req.query.search) {
    const search = slugify(req.query.search, {
      lower: true,
      locale: "vi"
    });
    const searchRegex = new RegExp(search);
    find.slug = searchRegex;
  }

  const limitItem = 3;
  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  let page = 1;
  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (currentPage > 0)
      page = currentPage
  }
  if (page > totalPage && totalPage != 0)
    page = totalPage

  const skip = (page - 1) * limitItem;

  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    skip: skip
  }

  const adminAccountList = await AccountAdmin.find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItem)
    .skip(skip);

  for (const item of adminAccountList) {
    if (item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      })
      item.roleInfo = roleInfo.name;
    }
  }

  const roleList = await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-account-admin-trash.pug", {
    pageTitle: "Thùng rác tài khoản quản trị",
    adminAccountList: adminAccountList,
    roleList: roleList,
    pagination: pagination
  })
}

module.exports.accountAdminTrashMultiApplyPatch = async (req, res) => {
  if (!req.permissions.includes("setting-admin-account")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  const { status, idList } = req.body;

  await AccountAdmin.updateMany({
    _id: { $in: idList }
  }, {
    deleted: false,
    deletedAt: Date.now(),
    deletedBy: req.account.id
  })
  req.flash("success", "Khôi phục thành công!");
  res.json({
    code: "success"
  })
}

module.exports.accountAdminTrashMultiApplyDelete = async (req, res) => {
  if (!req.permissions.includes("setting-admin-account")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  const { status, idList } = req.body;

  await AccountAdmin.deleteMany({
    _id: { $in: idList }
  })
  req.flash("success", "Xóa vĩnh viễn thành công!");
  res.json({
    code: "success"
  })
}

module.exports.accountAdminRecovery = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-admin-account")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }
    const id = req.params.id;
    await AccountAdmin.updateOne({
      _id: id
    }, {
      deleted: false,
      updatedBy: req.account.id,
      updatedAt: Date.now()
    })
    req.flash("success", "Khôi phục thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}

module.exports.accountAdminHardDelete = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-admin-account")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }
    const id = req.params.id;
    await AccountAdmin.deleteOne({
      _id: id
    })
    req.flash("success", "Xóa vĩnh viễn thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "ID không hợp lệ"
    })
  }
}

module.exports.roleList = async (req, res) => {
  const find = {
    deleted: false
  }

  if (req.query.search) {
    const search = slugify(req.query.search, {
      lower: true,
      locale: 'vi'
    });
    const searchRegex = new RegExp(search);
    find.slug = searchRegex;
  }

  const roleList = await Role.find(find);

  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: "Nhóm quyền",
    roleList: roleList
  })
}

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionList.permissionList
  })
}

module.exports.roleCreatePost = async (req, res) => {
  if (!req.permissions.includes("setting-role")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;

  const newRecord = new Role(req.body);
  await newRecord.save();

  req.flash("success", "Tạo nhóm quyền thành công!");
  res.json({
    code: "success"
  })
}

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    })
    if (roleDetail) {
      res.render("admin/pages/setting-role-edit.pug", {
        pageTitle: "Tạo nhóm quyền",
        permissionList: permissionList.permissionList,
        roleDetail: roleDetail
      })
    }
    else res.redirect(`/${pathAdmin}/setting/role/list`);
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
}

module.exports.roleEditPatch = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-role")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }
    const id = req.params.id;

    await Role.updateOne({
      _id: id
    }, req.body)

    req.flash("success", "Chỉnh sửa nhóm quyền thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
}

module.exports.roleApplyMulti = async (req, res) => {
  if (!req.permissions.includes("setting-role")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }
  await Role.deleteMany({
    _id: { $in: req.body.roleList }
  })

  req.flash("success", "Áp dụng thành công!");
  res.json({
    code: "success"
  })
}
module.exports.roleDelete = async (req, res) => {
  try {
    if (!req.permissions.includes("setting-role")) {
      res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!"
      })
      return;
    }
    const id = req.params.id;

    await Role.deleteOne({
      _id: id
    })

    req.flash("success", "Áp dụng thành công!");
    res.json({
      code: "success"
    })
  }
  catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
}