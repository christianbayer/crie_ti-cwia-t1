const router = require('express').Router();
const users = require('./users');
const products = require('./products');

router.use(users);
router.use(products);

module.exports = router;
