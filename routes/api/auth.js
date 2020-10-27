const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const mail = require('../../middleware/nodemailer');

const User = require('../../models/User');
const Token = require('../../models/Token');
// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
	'/',
	[ check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists() ],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log('error');
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (!user) {
				//console.log('error');
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				//console.log('error');
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}

			if (!user.isVerified) {
				//console.log('error');
				// Create verification token
				let token = new Token({ _userId: user.id, token: nanoid(16) });

				token.save(function (err) {
					if (err) {
						return res.status(500).send({ msg: err.message });
					}

					// Send verification email
					mail.sendEmail(req, user, token);
				});
				return res.status(400).json({
					errors: [
						{
							msg:
								'You have to be verified in order to login. Please check your email to confirm verification'
						}
					]
				});
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '5 days' }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route    GET api/auth/confirmation/token
// @desc     Confirm verification token
// @access   Private
router.get('/confirmation/:token', async (req, res) => {
	try {
		let token = await Token.findOne({ token: req.params.token });
		if (!token)
			return res.status(400).send({
				type: 'not-verified',
				msg: 'We were unable to find a valid token. Your token may have expired.'
			});

		// let user = await User.findOne({  _id: token._userId  });
		User.findOne({ _id: token._userId }, (err, user) => {
			if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
			if (user.isVerified)
				return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

			// Verify and save the user
			user.isVerified = true;
			user.save(function (err) {
				if (err) {
					return res.status(500).send({ msg: err.message });
				}
				res.status(200).send('The account has been verified. Please return to the log in page.');
			});
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route    POST api/auth/verify
// @desc     Send verification token
// @access   Private
router.post('/verify', [ check('email', 'Please include a valid email').isEmail() ], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('error');
		return res.status(400).json({ errors: errors.array() });
	}

	let user = await User.findOne({ email: req.body.email });
	// Create verification token
	let token = await Token.findOne({ _userId: user.id });
	if (token) {
		// Send the email
		sendEmail();
	} else {
		token = new Token({ _userId: user.id, token: nanoid(16) });

		token.save(function (err) {
			if (err) {
				return res.status(500).send({ msg: err.message });
			}

			// Send the email
			mail.sendEmail(req, user, token);
		});
	}
});

module.exports = router;
