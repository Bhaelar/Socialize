import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initialState = {
	username: '',
	bio: '',
	twitter: '',
	facebook: '',
	instagram: ''
};

const ProfileForm = ({ profile: { profile, loading }, createProfile, getCurrentProfile, history }) => {
	const [ formData, setFormData ] = useState(initialState);

	const [ displaySocialInputs, toggleSocialInputs ] = useState(false);

	useEffect(
		() => {
			if (!profile) getCurrentProfile();
			if (!loading && profile) {
				const profileData = { ...initialState };
				for (const key in profile) {
					if (key in profileData) profileData[key] = profile[key];
				}
				for (const key in profile.social) {
					if (key in profileData) profileData[key] = profile.social[key];
				}
				setFormData(profileData);
			}
		},
		[ loading, getCurrentProfile, profile ]
	);

	const { username, bio, twitter, facebook, instagram } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


	const onSubmit = async (e) => {
		e.preventDefault();
		createProfile(formData, history, profile ? true : false);
	};

	
	return (
		<div className="ui container">
			<h1 className="ui header">Edit Your Profile</h1>
			<p className="lead">
				<i className="user icon" /> Add some changes to your profile
			</p>
			<form  onSubmit={onSubmit} className="ui form">
				<div className="field">
					<label>Username</label>
					<input type="text" placeholder="Username" name="username" value={username} onChange={onChange} />
				</div>
				<div className="field">
					<label>Bio</label>
					<textarea
						placeholder="Write something interesting about you"
						name="bio"
						value={bio}
						onChange={onChange}
					/>
				</div>

				<div className="my-2">
					<button
						onClick={() => toggleSocialInputs(!displaySocialInputs)}
						type="button"
						className="ui button"
					>
						Add Social Network Links
					</button>
					<span>Optional</span>
				</div>

				{displaySocialInputs && (
					<Fragment>
						<div className="field social-input">
							<i className="twitter icon fa-2x" />
							<input
								type="text"
								placeholder="Twitter URL"
								name="twitter"
								value={twitter}
								onChange={onChange}
							/>
						</div>

						<div className="field social-input">
							<i className="facebook icon fa-2x" />
							<input
								type="text"
								placeholder="Facebook URL"
								name="facebook"
								value={facebook}
								onChange={onChange}
							/>
						</div>

						<div className="field social-input">
							<i className="instagram icon fa-2x" />
							<input
								type="text"
								placeholder="Instagram URL"
								name="instagram"
								value={instagram}
								onChange={onChange}
							/>
						</div>
					</Fragment>
				)}

				<button type="submit" className="ui green submit button">
					Submit
				</button>
				<Link className="ui button" to="/profile/me">
					Go Back
				</Link>
			</form>
		</div>
	);
};

ProfileForm.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(ProfileForm);
