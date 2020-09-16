const multer = require('multer');
var storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const multerUploads = multer({ storage }).single('image');
module.exports = multerUploads;
