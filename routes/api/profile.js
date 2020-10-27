const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');
const cloudinaryConfig = require('../../middleware/cloudinaryConfig');
var cloudinary = require('cloudinary');
const multerUploads = require('../../middleware/multerConfig');
const normalize = require('normalize-url');
const path = require('path');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate('user', [ 'name', 'avatar' ]);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
	'/',
	[
		auth,
		[ check('username', 'Username is required').not().isEmpty(), check('bio', 'Bio is required').not().isEmpty() ]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { username, bio, twitter, instagram, facebook } = req.body;

		const profileFields = {
			user: req.user.id,
			username,
			bio
		};

		// Build social object and add to profileFields
		const socialfields = { twitter, instagram, facebook };

		for (const [ key, value ] of Object.entries(socialfields)) {
			if (value && value.length > 0) socialfields[key] = normalize(value, { forceHttps: true });
		}
		profileFields.social = socialfields;

		try {
			const user = await User.findById(req.user.id).select('-password');
			let name = await Profile.findOne({ username });

			let profileuser = await Profile.findOne({ user: user.id });

			if (name && profileuser) {
				if (!name.user.equals(profileuser.user)) {
					return res.status(400).json({ errors: [ { msg: 'Username already taken' } ] });
				}
			}

			// Using upsert option (creates new doc if no match is found):
			let profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true, upsert: true }
			);
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    POST api/profile/upload
// @desc     Add profile picture
// @access   Private
router.post('/upload', auth, async (req, res) => {
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
	const { image } = req.body;
	try {
		let profile = await Profile.findOneAndUpdate({ user: req.user.id }, { avatar: image }, { new: true });
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [ 'name', 'avatar' ]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', checkObjectId('user_id'), async ({ params: { user_id } }, res) => {
	try {
		const profile = await Profile.findOne({
			user: user_id
		}).populate('user', [ 'name', 'avatar' ]);

		if (!profile) return res.status(400).json({ msg: 'Profile not found' });

		return res.json(profile);
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
	try {
		// Remove user posts
		await Post.deleteMany({ user: req.user.id });
		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findByIdAndRemove(req.user.id);

		res.json({ msg: 'User deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
