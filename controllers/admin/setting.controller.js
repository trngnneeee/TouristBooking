const WebsiteInformation = require("../../models/website-info.model")

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
  if (websiteInfo)
  {
    await websiteInfo.updateOne(req.body);
  }
  else
  {
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

module.exports.accountAdminCreate = (req, res) => {
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị"
  })
}

module.exports.roleList = (req, res) => {
  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: "Nhóm quyền"
  })
}

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: "Tạo nhóm quyền"
  })
}