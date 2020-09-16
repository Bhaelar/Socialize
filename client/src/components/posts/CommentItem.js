import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { likeComment, unlikeComment, deleteComment } from '../../actions/post';

const CommentItem = ({
	postId,
	comment: { _id, text, name, avatar, user, date, likes },
	auth,
	likeComment,
	unlikeComment,
	deleteComment,
	showActions
}) => (
	<div className="ui container posts">
		<div className="ui comments">
			<h3 className="ui dividing header">Comments</h3>
			<div className="comment">
				<Link to={`/profile/user/${user}`} className="avatar">
					<img className="ui avatar image" src={avatar} alt="" />
				</Link>
				<div className="content">
					<Link to={`/profile/user/${user}`} className="author">
						{name}
					</Link>
					<div className="metadata">
						<span className="date">
							Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
						</span>
					</div>
					<div className="text">{text}</div>
				</div>

				{showActions && (
					<div className="actions actionbuttons">
						<button onClick={() => likeComment(postId, _id)} className="mini ui button">
							<i className="thumbs up icon" />
							<span>{likes.length > 0 && <span>{likes.length}</span>}</span>
						</button>
						<button onClick={() => unlikeComment(postId, _id)} className="mini ui button">
							<i className="thumbs down icon" />
						</button>
						{!auth.loading &&
						user === auth.user._id && (
							<button onClick={() => deleteComment(postId, _id)} className="mini negative ui button">
								<i className="times icon" />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	</div>
);

CommentItem.defaultProps = {
	showActions: true
};

CommentItem.propTypes = {
	postId: PropTypes.string.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired,
	showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { likeComment, unlikeComment, deleteComment })(CommentItem);
