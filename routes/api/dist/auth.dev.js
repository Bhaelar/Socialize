"use strict";

var express = require('express');

var router = express.Router();

var bcrypt = require('bcryptjs');

var auth = require('../../middleware/auth');

var jwt = require('jsonwebtoken');

var config = require('config');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var _require2 = require('nanoid'),
    nanoid = _require2.nanoid;

var mail = require('../../middleware/nodemailer');

var User = require('../../models/User');

var Token = require('../../models/Token'); // @route    GET api/auth
// @desc     Get user by token
// @access   Private


router.get('/', auth, function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select('-password'));

        case 3:
          user = _context.sent;
          res.json(user);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send('Server Error');

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

router.post('/', [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()], function _callee2(req, res) {
  var errors, _req$body, email, password, user, isMatch, token, payload;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 4;
            break;
          }

          console.log('error');
          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 4:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 8:
          user = _context2.sent;

          if (user) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: [{
              msg: 'Invalid Credentials'
            }]
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 13:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: [{
              msg: 'Invalid Credentials'
            }]
          }));

        case 16:
          if (user.isVerified) {
            _context2.next = 20;
            break;
          }

          //console.log('error');
          // Create verification token
          token = new Token({
            _userId: user.id,
            token: nanoid(16)
          });
          token.save(function (err) {
            if (err) {
              return res.status(500).send({
                msg: err.message
              });
            } // Send verification email


            mail.sendEmail(req, user, token);
          });
          return _context2.abrupt("return", res.status(400).json({
            errors: [{
              msg: 'You have to be verified in order to login. Please check your email to confirm verification'
            }]
          }));

        case 20:
          payload = {
            user: {
              id: user.id
            }
          };
          jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '5 days'
          }, function (err, token) {
            if (err) throw err;
            res.json({
              token: token
            });
          });
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](5);
          console.error(_context2.t0.message);
          res.status(500).send('Server error');

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 24]]);
}); // @route    GET api/auth/confirmation/token
// @desc     Confirm verification token
// @access   Private

router.get('/confirmation/:token', function _callee3(req, res) {
  var token;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Token.findOne({
            token: req.params.token
          }));

        case 3:
          token = _context3.sent;

          if (token) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).send({
            type: 'not-verified',
            msg: 'We were unable to find a valid token. Your token may have expired.'
          }));

        case 6:
          // let user = await User.findOne({  _id: token._userId  });
          User.findOne({
            _id: token._userId
          }, function (err, user) {
            if (!user) return res.status(400).send({
              msg: 'We were unable to find a user for this token.'
            });
            if (user.isVerified) return res.status(400).send({
              type: 'already-verified',
              msg: 'This user has already been verified.'
            }); // Verify and save the user

            user.isVerified = true;
            user.save(function (err) {
              if (err) {
                return res.status(500).send({
                  msg: err.message
                });
              }

              res.status(200).send('The account has been verified. Please return to the log in page.');
            });
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0.message);
          res.status(500).send('Server error');

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // @route    POST api/auth/verify
// @desc     Send verification token
// @access   Private

router.post('/verify', [check('email', 'Please include a valid email').isEmail()], function _callee4(req, res) {
  var errors, user, token;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context4.next = 4;
            break;
          }

          console.log('error');
          return _context4.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 6:
          user = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(Token.findOne({
            _userId: user.id
          }));

        case 9:
          token = _context4.sent;

          if (token) {
            // Send the email
            sendEmail();
          } else {
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
          }

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;