const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const brcypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const mail = require('../../middleware/nodemailer');

const User = require('../../models/User');
const Token = require('../../models/Token');
// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Enter a valid email').isEmail(),
		check('password', 'Enter a password with 6 or more characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;
		try {
			// Check if email has been registered
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ errors: [ { msg: 'Email already exists' } ] });
			}

			// Create instance of User model
			user = new User({
				name,
				email,
				password
			});

			// Encrypt password and save user
			const salt = await brcypt.genSalt(10);

			user.password = await brcypt.hash(password, salt);

			await user.save();

			res.json({ user });

			// Create verification token
			let token = new Token({ _userId: user.id, token: nanoid(16) });

			token.save(function (err) {
				if (err) {
					return res.status(500).send({ msg: err.message });
				}

				// Send the email
				mail.sendEmail(req, user, token);
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
