const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	bio: {
		type: String,
		default: '...'
	},
    avatar: {
		type: String,
		default: 'https://res.cloudinary.com/dxjqyiczd/image/upload/v1599856641/676-6764065_default-profile-picture-transparent-hd-png-download_v8kkwr.png'
    },
	social: {
		twitter: {
			type: String
		},
		facebook: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
