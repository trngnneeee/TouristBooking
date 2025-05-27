const Joi = require('joi');

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^\S+$/)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên danh mục!",
        "string.pattern.base": "Tên voucher không được chứa khoảng trắng!"
      }), 
    percentage: Joi.string()
      .required()
      .messages({
         "string.empty": "Vui lòng nhập phần trăm giảm của voucher!",
      }),
    maxDiscount: Joi.string().allow(""),
    expire: Joi.string()
      .required()
      .messages({
         "string.empty": "Vui lòng nhập ngày hết hạn của voucher!",
      }),
    status: Joi.string().allow("")
  })

  const {error} = schema.validate(req.body);

  if (error)
  {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}