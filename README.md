# Socialize
A social media application where users can share thoughts, interact and socialize. Developed with Node, MongoDb, React.

## Quick Start
**Add a default.json file in config folder with the following** (Remove <> when inputting values)
```
{
    "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
    "jwtSecret": "mySecretToken",
    "email": "<email_address>",
    "password": "<email_password>",
    "cloud_name": "<cloudinary_cloud_name>",
    "api_key": "<cloudinary_api_key>",
    "api_secret": "<cloudinary_api_secret>",
    "ClientID": "<oauth_client_id>",
    "Client_secret": "<oauth_client_secret>",
    "refresh_token": "<oauth_refresh_token>"
}
```

**Add a .env file in the root of client folder with the following** (Remove <> when inputting values)
```
REACT_APP_CLOUD_NAME=<cloudinary_cloud_name>
REACT_APP_UPLOAD_PRESET=<cloudinary_unsigned_upload_preset>
```

**Install server dependencies**
```
npm install
```

**Install client dependencies**
```
cd client
npm install
```

**Run both Express & React from root**
```
npm run dev
```
