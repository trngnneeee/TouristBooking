const Contact = require("../../models/contact.model")

module.exports.createPost = async (req, res) => {
  const existEmail = await Contact.findOne({
    email: req.body.email
  })

  if (existEmail)
  {
    res.json({
      code: "error",
      message: "Email của bạn đã được đăng ký!"
    });
    return;
  }

  const newRecord = new Contact(req.body);
  await newRecord.save();
  
  req.flash("success", "Đăng ký thành công!");  
  res.json({
    code: "success"
  })
}