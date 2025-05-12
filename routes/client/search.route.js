const router = require('express').Router();

const SearchController =  require("../../controllers/client/search.controller");

router.get('/', SearchController.list);

module.exports = router;