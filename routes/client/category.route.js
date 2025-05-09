const router = require('express').Router();

const CategoryController =  require("../../controllers/client/category.controller");

router.get('/:slug', CategoryController.list);

module.exports = router;