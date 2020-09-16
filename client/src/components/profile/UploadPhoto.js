/* import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from 'react-md';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadPhoto } from '../../actions/profile';

class UploadPhoto extends React.Component {
	constructor () {
		super();
		this.state = {
			selectedFile: null
		};
	}
	onChange = (e) => {
		const file = e.target.files[0];
		this.setState({ selectedFile: file });
	};

	onSubmit = (e) => {
		
		e.preventDefault();
		if (!this.state.selectedFile) return;
		const formData = new FormData();
        formData.append(
          'image',
          this.state.selectedFile,
          this.state.selectedFile.name
		); 
		const { files } = document.querySelector('input[type="file"]');
		const formData = new FormData();
		formData.append('image', files[0].name);
		
		this.props.uploadPhoto(formData);
	};

	render () {
		return (
			<div className="ui container">
				<h1 className="ui header">Upload Avatar</h1>

				<form onSubmit={this.onSubmit} className="ui form">
					<div className="field">
						<input type="file" label="Upload photo" accept="image/*" name="image" />
					</div>

					<button type="submit" className="ui green submit button">
						Submit
					</button>
					<Link className="ui button" to="/profile/me">
						Go Back
					</Link>
				</form>
			</div>
		);
	}
}

UploadPhoto.propTypes = {
	uploadPhoto: PropTypes.func.isRequired
};

export default connect(null, { uploadPhoto })(UploadPhoto); */

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
			cloudName: 'dxjqyiczd',
			tags: [ tag, 'anImage' ],
			uploadPreset: 'q2ud5g8l'
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
		<CloudinaryContext cloudName="dxjqyiczd">
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
