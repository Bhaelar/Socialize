"use strict";

var express = require('express');

var router = express.Router();

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var brcypt = require('bcryptjs');

var _require2 = require('nanoid'),
    nanoid = _require2.nanoid;

var mail = require('../../middleware/nodemailer');

var User = require('../../models/User');

var Token = require('../../models/Token'); // @route   POST api/users
// @desc    Register user
// @access  Public


router.post('/', [check('name', 'Name is required').not().isEmpty(), check('email', 'Enter a valid email').isEmail(), check('password', 'Enter a password with 6 or more characters').isLength({
  min: 6
})], function _callee(req, res) {
  var errors, _req$body, name, email, password, user, salt, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          user = _context.sent;

          if (!user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: [{
              msg: 'Email already exists'
            }]
          }));

        case 10:
          // Create instance of User model
          user = new User({
            name: name,
            email: email,
            password: password
          }); // Encrypt password and save user

          _context.next = 13;
          return regeneratorRuntime.awrap(brcypt.genSalt(10));

        case 13:
          salt = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(brcypt.hash(password, salt));

        case 16:
          user.password = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          res.json({
            user: user
          }); // Create verification token

          token = new Token({
            _userId: user.id,
            token: nanoid(16)
          });
          token.save(function (err) {
            if (err) {
              return res.status(500).send({
                msg: err.message
              });
            } // Send the email


            mail.sendEmail(req, user, token);
          });
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](4);
          console.error(_context.t0.message);
          res.status(500).send('Server error');

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 24]]);
});
module.exports = router;