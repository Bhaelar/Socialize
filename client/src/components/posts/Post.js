import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import PostItem from './PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPost } from '../../actions/post';
import { getCurrentProfile } from '../../actions/profile';

const Post = ({ getCurrentProfile, getPost, post: { post, loading }, profile: { profile }, match }) => {
	useEffect(
		() => {
			getPost(match.params.id);
		},
		[ getPost, match.params.id ]
	);

	useEffect(
		() => {
			getCurrentProfile();
		},
		[ getCurrentProfile ]
	);

	return loading || post === null ? (
		<Spinner />
	) : profile === null ? (
		<Fragment>
			<Link to="/home" className="ui button">
				Back To Posts
			</Link>
			<PostItem post={post} showActions={false} />

			<div className="ui text container">
				{post.comments.map((comment) => <CommentItem key={comment._id} comment={comment} postId={post._id} />)}
			</div>

			<div className="ui container">
				<p>You need to create a profile in order to be able to comment</p>
				<Link to="/create-profile" className="ui primary button">
					Create Profile
				</Link>
			</div>
		</Fragment>
	) : (
		<Fragment>
			<Link to="/home" className="ui button">
				Back To Posts
			</Link>
			<PostItem post={post} showActions={false} />

			<div className="ui text container">
				{post.comments.map((comment) => <CommentItem key={comment._id} comment={comment} postId={post._id} />)}
			</div>

			<CommentForm postId={post._id} />
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	post: state.post,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, getPost })(Post);
