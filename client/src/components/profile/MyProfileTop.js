import React from 'react';
import ModalImage from 'react-modal-image';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MyProfileTop = ({ profile: { social, username, avatar, bio, user } }) => {
	return (
		<div className="ui container">
			<div className="ui card">
				<div className="image">
					<ModalImage
						small={avatar}
						medium={avatar}
						large={avatar}
						alt=""
					/>
				</div>
				<div className="content">
					<h2 className="header">{username}</h2>
					<div className="meta">
						<Link className="mini ui button" to="/upload-photo">
							Update Avatar
						</Link>
					</div>
					<div className="description">{bio}</div>
				</div>
				<div className="extra content">
					{social &&
					social.twitter && (
						<a href={social.twitter} target="_blank" rel="noopener noreferrer">
							<i className="ui twitter icon" />
						</a>
					)}
					{social &&
					social.facebook && (
						<a href={social.facebook} target="_blank" rel="noopener noreferrer">
							<i className="ui facebook icon" />
						</a>
					)}
					{social &&
					social.instagram && (
						<a href={social.instagram} target="_blank" rel="noopener noreferrer">
							<i className="ui instagram icon" />
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

MyProfileTop.propTypes = {
	profile: PropTypes.object.isRequired
};

export default MyProfileTop;
