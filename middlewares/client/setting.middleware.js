const WebsiteInformation = require("../../models/website-info.model");

module.exports.websiteInfo = async (req, res, next) => {
  const websiteInfo = await WebsiteInformation.findOne({});

  res.locals.websiteInfo = websiteInfo;

  next();
}