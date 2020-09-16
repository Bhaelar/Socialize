import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post';

export const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading || posts === null ? (
    <Spinner />
  ) : (
    <div className="ui text container">
      <h1 className="ui header">Posts</h1>
      <Link to='/new-post' className="ui green button">Create new post</Link>
      <div className="ui text container posts">
        { posts.length > 0 ?
          (posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))) : <p>There are no posts to display</p>}
      </div>
    </div>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
