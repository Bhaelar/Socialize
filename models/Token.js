const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user'
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 43200
	}
});

module.exports = Token = mongoose.model('token', TokenSchema);