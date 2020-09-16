import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost, history }) => {
	const [ formData, setFormData ] = useState({
		title: '',
		text: ''
	});

	const { title, text } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		addPost({ title, text }, history);
	};

	return (
		<div className="ui container">
			<h3 className="ui dividing header">Say Something...</h3>

			<form onSubmit={(e) => onSubmit(e)} className="ui form textform">
				<div className="field">
					<label>Title</label>
					<input type="text" name="title" placeholder="Enter title" value={title} onChange={onChange} />
				</div>
				<div className="field">
					<label>Text</label>
					<textarea name="text" placeholder="Enter Post" value={text} onChange={onChange} />
				</div>
				<button type="submit" className="ui green submit button">
					Submit
				</button>
				<Link to="/home" className="ui button">
					Go back
				</Link>
			</form>
		</div>
	);
};

PostForm.propTypes = {
	addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
