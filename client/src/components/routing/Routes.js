import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Post from '../posts/Post';
import PostForm from '../posts/PostForm';
import Posts from '../posts/Posts';
import Profile from '../profile/Profile';
import MyProfile from '../profile/MyProfile';
import ProfileForm from '../profile/ProfileForm';
import UploadPhoto from '../profile/UploadPhoto';
import NotFound from '../layout/NotFound';
import PrivateRoute from './PrivateRoutes';

const Routes = () => {
  return (
    <div>
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/home" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <PrivateRoute exact path="/new-post" component={PostForm} />
        <PrivateRoute exact path="/profile/me" component={MyProfile} />
        <PrivateRoute exact path="/profile/user/:id" component={Profile} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/upload-photo" component={UploadPhoto} />
        <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routes;
