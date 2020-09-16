import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

export const Register = ({ newUser, register, setAlert }) => {
	const [ formData, setFormData ] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const { name, email, password, password2 } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			setAlert('Passwords do not match', 'danger');
		} else {
			register({ name, email, password });
		}
	};

	if (newUser) {
		return <Redirect to="/login" />;
	}

	return (
		<div className="ui middle aligned center aligned grid" id="register">
			<div className="column">
				<h2 className="ui green header">
					<div className="content">Sign up with us</div>
				</h2>
				<form onSubmit={(e) => onSubmit(e)} className="ui large form" autoComplete="off">
					<div className="ui stacked segment">
						<div className="field">
							<div className="ui left icon input">
								<i className="user icon" />
								<input
									type="text"
									name="name"
									value={name}
									onChange={onChange}
									placeholder="Enter your name"
								/>
							</div>
						</div>
						<div className="field">
							<div className="ui left icon input">
								<i className="at icon" />
								<input
									type="email"
									name="email"
									value={email}
									onChange={onChange}
									placeholder="Enter your email"
									autoComplete="new-password"
								/>
							</div>
						</div>
						<div className="field">
							<div className="ui left icon input">
								<i className="lock icon" />
								<input
									type="password"
									name="password"
									value={password}
									onChange={onChange}
									placeholder="Enter your password"
									autoComplete="new-password"
								/>
							</div>
						</div>
						<div className="field">
							<div className="ui left icon input">
								<i className="lock icon" />
								<input
									type="password"
									name="password2"
									value={password2}
									onChange={onChange}
									placeholder="Re-enter your password"
								/>
							</div>
						</div>
						<button type="submit" className="ui green large submit button">Register</button>
					</div>
					<div className="ui error message" />
				</form>
				<div className="ui message">
					Have an account?<Link to="/login">Login</Link>{' '}
				</div>
			</div>
		</div>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
	newUser: state.auth.newUser
});

export default connect(mapStateToProps, { register, setAlert })(Register);
