import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import ProfileTop from './ProfileTop';
import MyProfileTop from './MyProfileTop';
import { getProfileById, deleteAccount } from '../../actions/profile';

const Profile = ({ getProfileById, deleteAccount, profile: { profile, loading }, auth, match }) => {
	useEffect(
		() => {
			getProfileById(match.params.id);
		},
		[ getProfileById, match.params.id ]
	);

	return loading || profile === null ? (
		<Spinner />
	) : match.params.id === auth.user._id ? (<Fragment>
			<div className="ui container">
				<div className="column">
					<h1 className="ui header">Dashboard</h1>
					<p className="lead">
						<i className="user icon" /> Welcome {auth.user && auth.user.name}
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
	</Fragment>): (
		<Fragment>
			<div className="ui container">
				<div className="column">
					<h2 className="ui header">{`${profile.username}'s Profile`}</h2>
					{profile !== null ? (
						<Fragment>
							<ProfileTop profile={profile} />
						</Fragment>
					) : (
						<Fragment>
							<p>Profile doesn't exist</p>
							<Link to="/home" className="ui button">
								Go back
							</Link>
						</Fragment>
					)}
				</div>
			</div>
		</Fragment>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(mapStateToProps, { getProfileById, deleteAccount })(Profile);
