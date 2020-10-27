import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';
import { connect } from 'react-redux';
import MyProfileTop from './MyProfileTop';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const MyProfile = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {
	useEffect(
		() => {
			getCurrentProfile();
		},
		[ getCurrentProfile ]
	);

	return loading === null ? (
		<Spinner />
	) : (
		<Fragment>
			<div className="ui container">
				<div className="column">
					<h1 className="ui header">Dashboard</h1>
					<p className="lead">
						<i className="user icon" /> Welcome {user && user.name}
					</p>
					{profile !== null ? (
						<Fragment>
							<MyProfileTop profile={profile} />

							<Link to="/edit-profile" className="ui button">
								<i className="user circle icon" /> Edit Profile
							</Link>

							<button className="negative ui button" onClick={() => deleteAccount()}>
								<i className="user minus icon" /> Delete My Account
							</button>
						</Fragment>
					) : (
						<Fragment>
							<p>You have not yet setup a profile, please add some info</p>
							<Link to="/create-profile" className="ui primary button">
								Create Profile
							</Link>
						</Fragment>
					)}
				</div>
			</div>
		</Fragment>
	);
};

MyProfile.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(MyProfile);
