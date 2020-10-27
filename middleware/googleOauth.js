const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('config');

const oauth2Client = new OAuth2(
	config.get('ClientID'), // ClientID
	config.get('Client_secret'), // Client Secret
	'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
	refresh_token: config.get('refresh_token')
});
const accessToken = oauth2Client.getAccessToken();

module.exports = accessToken;