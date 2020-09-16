import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../App.css';

const Landing = () => {
	const [ spinner, setSpinner ] = useState(true);

	// It will be executed before rendering

	useEffect(() => {
		setTimeout(() => setSpinner(false), 5000);
	}, []);

	return (
		!spinner && (
			<div className="ui vertical center aligned segment" id="landing">
				<div className="ui text container">
					<h1 className="ui green header">Socialize</h1>
					<h5>Connect, share, socialize</h5>
					<Link to="/register" className="ui large inverted green button">
						Register
					</Link>
					<Link to="/login" className="ui large inverted green button">
						Login
					</Link>
				</div>
			</div>
		)
	);
};

export default Landing;
