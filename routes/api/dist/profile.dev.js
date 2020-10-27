"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var router = express.Router();

var auth = require('../../middleware/auth');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var checkObjectId = require('../../middleware/checkObjectId');

var cloudinaryConfig = require('../../middleware/cloudinaryConfig');

var cloudinary = require('cloudinary');

var multerUploads = require('../../middleware/multerConfig');

var normalize = require('normalize-url');

var path = require('path');

var Profile = require('../../models/Profile');

var User = require('../../models/User'); // @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private


router.get('/me', auth, function _callee(req, res) {
  var profile;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Profile.findOne({
            user: req.user.id
          }).populate('user', ['name', 'avatar']));

        case 3:
          profile = _context.sent;

          if (profile) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            msg: 'There is no profile for this user'
          }));

        case 6:
          res.json(profile);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send('Server Error');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post('/', [auth, [check('username', 'Username is required').not().isEmpty(), check('bio', 'Bio is required').not().isEmpty()]], function _callee2(req, res) {
  var errors, _req$body, username, bio, twitter, instagram, facebook, profileFields, socialfields, _i, _Object$entries, _Object$entries$_i, key, value, user, name, profileuser, profile;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, username = _req$body.username, bio = _req$body.bio, twitter = _req$body.twitter, instagram = _req$body.instagram, facebook = _req$body.facebook;
          profileFields = {
            user: req.user.id,
            username: username,
            bio: bio
          }; // Build social object and add to profileFields

          socialfields = {
            twitter: twitter,
            instagram: instagram,
            facebook: facebook
          };

          for (_i = 0, _Object$entries = Object.entries(socialfields); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
            if (value && value.length > 0) socialfields[key] = normalize(value, {
              forceHttps: true
            });
          }

          profileFields.social = socialfields;
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select('-password'));

        case 11:
          user = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(Profile.findOne({
            username: username
          }));

        case 14:
          name = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(Profile.findOne({
            user: user.id
          }));

        case 17:
          profileuser = _context2.sent;

          if (!(name && profileuser)) {
            _context2.next = 21;
            break;
          }

          if (name.user.equals(profileuser.user)) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: [{
              msg: 'Username already taken'
            }]
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: profileFields
          }, {
            "new": true,
            upsert: true
          }));

        case 23:
          profile = _context2.sent;
          res.json(profile);
          _context2.next = 31;
          break;

        case 27:
          _context2.prev = 27;
          _context2.t0 = _context2["catch"](8);
          console.error(_context2.t0.message);
          res.status(500).send('Server Error');

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 27]]);
}); // @route    POST api/profile/upload
// @desc     Add profile picture
// @access   Private

router.post('/upload', auth, function _callee3(req, res) {
  var image, profile;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Backend upload logic. Add multeruploads in argument

          /*
          const file = req.file.path;
          
          console.log(file);
          cloudinaryConfig(file).then(async (result) => {
          	
          	const filepath = result.url;
          	console.log(filepath);
          	let profile = await Profile.findOneAndUpdate({ user: req.user.id }, { avatar: filepath }, {new: true});
          	res.json(profile);
          }).catch (function(err) {
          	console.error(err.message);
          	res.status(500).send('Server Error');
          }) */
          // Frontend upload logic
          image = req.body.image;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            avatar: image
          }, {
            "new": true
          }));

        case 4:
          profile = _context3.sent;
          res.json(profile);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error(_context3.t0.message);
          res.status(500).send('Server Error');

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/', function _callee4(req, res) {
  var profiles;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Profile.find().populate('user', ['name', 'avatar']));

        case 3:
          profiles = _context4.sent;
          res.json(profiles);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0.message);
          res.status(500).send('Server Error');

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/user/:user_id', checkObjectId('user_id'), function _callee5(_ref, res) {
  var user_id, profile;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          user_id = _ref.params.user_id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Profile.findOne({
            user: user_id
          }).populate('user', ['name', 'avatar']));

        case 4:
          profile = _context5.sent;

          if (profile) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            msg: 'Profile not found'
          }));

        case 7:
          return _context5.abrupt("return", res.json(profile));

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error(_context5.t0.message);
          return _context5.abrupt("return", res.status(500).json({
            msg: 'Server error'
          }));

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
}); // @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private

router["delete"]('/', auth, function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Post.deleteMany({
            user: req.user.id
          }));

        case 3:
          _context6.next = 5;
          return regeneratorRuntime.awrap(Profile.findOneAndRemove({
            user: req.user.id
          }));

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(User.findOneAndRemove({
            _id: req.user.id
          }));

        case 7:
          res.json({
            msg: 'User deleted'
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0.message);
          res.status(500).send('Server Error');

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;