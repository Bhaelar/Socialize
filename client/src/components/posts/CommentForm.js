import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
	const [ text, setText ] = useState('');

	return (
		<div className="ui container posts">
			<h3 className="ui dividing header headings">Leave a comment...</h3>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					addComment(postId, { text });
					setText('');
				}}
				className="ui form"
			>
				<div className="field">
					<textarea
						name="text"
						placeholder="Comment on the post"
						value={text}
						onChange={(e) => setText(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="ui green submit button">
					Submit
				</button>
			</form>
		</div>
	);
};

CommentForm.propTypes = {
	addComment: PropTypes.func.isRequired
};

export default connect(null, { addComment })(CommentForm);
