import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import Alert from '../layout/Alert';

export const Login = ({ login, isAuthenticated }) => {
	const [ formData, setFormData ] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		login({ email, password });
	};

	if (isAuthenticated) {
		return <Redirect to='/home' />;
	}
	return (
		<div className="ui middle aligned center aligned grid" id="login">
			<div className="column">
				<h2 className="ui green header">
					<div className="content">Log in</div>
				</h2>
				<form onSubmit={(e) => onSubmit(e)} className="ui large form" autoComplete="off">
					<div className="ui stacked segment">
						<div className="field">
							<div className="ui left icon input">
								<i className="at icon" />
								<input
									type="email"
									name="email"
									value={email}
									onChange={onChange}
									placeholder="Enter your email"
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
								/>
							</div>
						</div>
						<button type="submit" className="ui green large submit button">
							Login
						</button>
					</div>
				</form>
				<div className="ui message">
					Don't have an account?<Link to="/register">Sign Up</Link>{' '}
				</div>
				<Alert />
			</div>
		</div>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
