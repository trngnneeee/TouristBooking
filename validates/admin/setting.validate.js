const Joi = require('joi');

module.exports.websiteInfoPatch = (req, res, next) => {
  const schema = Joi.object({
    websiteName: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên danh mục!"
      }),
    phone: Joi.string().allow(""),
    email: Joi.string().allow(""),
    address: Joi.string().allow(""),
    logo: Joi.string().allow(""),
    favicon: Joi.string().allow("")
  })

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}

module.exports.roleCreatePost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên danh mục!"
      }),
    description: Joi.string().allow(""),
    permissions: Joi.array().allow("")
  })

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}

module.exports.accountAdminCreatePost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.min": "Họ tên phải có ít nhất 5 ký tự!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    phone: Joi.string()
      .required()
      .pattern(/^(84|0[3|5|7|8|9])[0-9]{8}$/)
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!"
      }),
    positionCompany: Joi.string().allow(""),
    role: Joi.string().allow(""),
    status: Joi.string().allow(""),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value))
          return helpers.error("password.uppercase");
        if (!/[a-z]/.test(value))
          return helpers.error("password.lowercase");
        if (!/\d/.test(value))
          return helpers.error("password.number");
        if (!/[@$!%*?&]/.test(value))
          return helpers.error("password.specialChar")
        return value;
      }),
    avatar: Joi.string().allow("")
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.specialChar": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"
      })
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}

module.exports.accountAdminEditPatch = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.min": "Họ tên phải có ít nhất 5 ký tự!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    phone: Joi.string()
      .required()
      .pattern(/^(84|0[3|5|7|8|9])[0-9]{8}$/)
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!"
      }),
    positionCompany: Joi.string().allow(""),
    role: Joi.string().allow(""),
    status: Joi.string().allow(""),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value))
          return helpers.error("password.uppercase");
        if (!/[a-z]/.test(value))
          return helpers.error("password.lowercase");
        if (!/\d/.test(value))
          return helpers.error("password.number");
        if (!/[@$!%*?&]/.test(value))
          return helpers.error("password.specialChar")
        return value;
      }),
    avatar: Joi.string().allow("")
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.specialChar": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"
      })
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}