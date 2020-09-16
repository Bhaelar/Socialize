const cloudinary = require('cloudinary');
const config = require('config');
const Q = require('q');

let upload = (file) => {
	cloudinary.config({
		cloud_name: config.get('cloud_name'),
		api_key: config.get('api_key'),
		api_secret: config.get('api_secret')
	});

	return new Q.Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(file, { width: 1024, height: 768 }, (err, res) => {
			if (err) {
				console.log('cloudinary err:', err);
				reject(err);
			} else {
				console.log('cloudinary res:', res);
				return resolve(res.url);
			}
		});
	});
};

module.exports = upload;
