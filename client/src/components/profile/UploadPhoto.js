import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudinaryContext, Image } from 'cloudinary-react';
import { openUploadWidget } from '../../utils/CloudinaryService';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadPhoto } from '../../actions/profile';

const UploadPhoto = ({ uploadPhoto, history }) => {
	const [ images, setImages ] = useState([]);

	const beginUpload = (tag) => {
		const uploadOptions = {
			cloudName: `${process.env.REACT_APP_CLOUD_NAME}`,
			tags: [ tag, 'anImage' ],
			uploadPreset: `${process.env.REACT_APP_UPLOAD_PRESET}`
		};
		openUploadWidget(uploadOptions, (error, photos) => {
			if (!error) {
				console.log(photos);
				if (photos.event === 'success') {
					setImages([ ...images, photos.info.public_id ]);
					//console.log(photos.info.secure_url);

					const data = { image: photos.info.secure_url };
					console.log(data);
					uploadPhoto(data, history);
				}
			} else {
				console.log(error);
			}
		});
	};

	/*
  useEffect( () => {
    fetchPhotos("image", setImages);
  }, []) */

	return (
		<CloudinaryContext cloudName={`${process.env.REACT_APP_CLOUD_NAME}`}>
			<div className="ui container">
				<button className="ui green button" onClick={() => beginUpload('image')}>
					Upload Image
				</button>
				<Link className="ui button" to="/profile/me">
					Go Back
				</Link>
				<section>
					{images.map((i) => <Image key={i} publicId={i} fetch-format="auto" quality="auto" />)}
				</section>
			</div>
		</CloudinaryContext>
	);
};

UploadPhoto.propTypes = {
	uploadPhoto: PropTypes.func.isRequired
};

export default connect(null, { uploadPhoto })(UploadPhoto);
