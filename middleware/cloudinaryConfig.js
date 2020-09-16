const cloudinary = require('cloudinary');
const config = require('config');

cloudinary.config({
	cloud_name: config.get('cloud_name'),
	api_key: config.get('api_key'),
	api_secret: config.get('api_secret')
});
const cloudinaryConfig = (file) => {
	return new Promise((resolve) => {
		cloudinary.uploader.upload(
			file,
			(result) => {
				resolve({ url: result.url });
			},
			{ resource_type: 'auto' }
		);
	});
};

module.exports = cloudinaryConfig;
