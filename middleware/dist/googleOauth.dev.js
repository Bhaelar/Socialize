"use strict";

var _require = require('googleapis'),
    google = _require.google;

var OAuth2 = google.auth.OAuth2;

var config = require('config');

var oauth2Client = new OAuth2(config.get('ClientID'), // ClientID
config.get('Client_secret'), // Client Secret
'https://developers.google.com/oauthplayground' // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: config.get('refresh_token')
});
var accessToken = oauth2Client.getAccessToken();
module.exports = accessToken;