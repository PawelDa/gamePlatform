const express = require('express');
const router = express.Router();

// @route           GET api/users
// @description     Test route
// @acces           Public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
