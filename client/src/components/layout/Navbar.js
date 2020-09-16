import React from 'react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

export const Navbar = ({ logout }) => {
	return (
		<div className="ui secondary pointing menu">
			<NavLink to='/home' activeClassName="active" className="item">Home</NavLink>
			<NavLink to='/profile/me' activeClassName="active" className="item">Profile</NavLink>
			<div className="right menu">
				<button onClick={logout} className="ui negative button">Logout</button>
			</div>
		</div>
	);
};

Navbar.propTypes = {
	logout: PropTypes.func.isRequired
}



export default connect(null, {logout}) (Navbar);
