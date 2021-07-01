const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = requre('jsonwebtoken');
const { body, validationResult } = require('express-validator');
// Getting User model
const User = require('../../models/User');

// @route           POST api/users
// @description     Register user
// @acces           Public
router.post(
  '/',
  // user validation
  body('name', 'Name is required').not().notEmpty(),
  // email validation
  body('email', 'Please provide a valid email address').isEmail(),
  // password validation
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //if User exists
      if(user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists'}] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // saving user
      await user.save();

      // TODO return jsonwebtoken

      res.send('User registered');
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
