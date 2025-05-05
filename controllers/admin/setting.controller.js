const WebsiteInformation = require("../../models/website-info.model")
const permissionList = require("../../config/permission-list.config");
const Role = require("../../models/role.model");
const slugify = require('slugify');
const bcrypt = require("bcryptjs");
const AccountAdmin = require("../../models/account-admin.model");

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

module.exports.accountAdminList = (req, res) => {
  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị"
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  })
  if (existAccount)
  {
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