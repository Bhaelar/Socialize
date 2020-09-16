import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
	addLike,
	removeLike,
	deletePost,
	auth,
	post: { post, _id, text, title, name, avatar, user, likes, comments, date, loading },
	showActions
}) => {
	return loading || post === null ? (
		<Spinner />
	) : (
		<div className="ui container posts">
			<div className="ui top attached segment">
				<Link to={`/profile/user/${user}`}>
					<img className="right floated ui avatar image" src={avatar} alt="" />
					<h4 className="ui header">{name}</h4>
				</Link>
			</div>
			<div className="ui attached segment">
				<h3 className="ui header">{title}</h3>
				<h4 className="ui header">{text}</h4>
				<p className="date">
					Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
				</p>
			</div>

			{showActions && (
				<div className="ui bottom attached segment">
					<button onClick={() => addLike(_id)} className="ui button">
						<i className="thumbs up icon" />
						<span>{likes.length > 0 && <span>{likes.length}</span>}</span>
					</button>
					<button onClick={() => removeLike(_id)} className="ui button">
						<i className="thumbs down icon" />
					</button>
					<Link to={`/posts/${_id}`} className="ui primary button">
						Discussion {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
					</Link>
					{!auth.loading &&
					user === auth.user._id && (
						<button onClick={() => deletePost(_id)} className="negative ui button">
							<i className="times icon" />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

PostItem.defaultProps = {
	showActions: true
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	removeLike: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
