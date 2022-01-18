const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");

let secrets = null;
if (process.env.TEST_PROD == "true") {
  secrets = process.env;
} else {
  secrets = require(process.env.SECRET_PATH);
}

const user = secrets.OAUTH_USER;
const clientID = secrets.OAUTH_CLIENT_ID;
const clientSecret = secrets.OAUTH_CLIENT_SECRET;
const redirectURL = secrets.OAUTH_REDIRECT_URL;
const refreshToken = secrets.OAUTH_REFRESH_TOKEN;

const oauth2Client = new OAuth2(clientID, clientSecret, redirectURL);

if (process.env.NODE_ENV == "production") {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  const gmailAccessToken = oauth2Client.getAccessToken();

  const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: user,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: gmailAccessToken,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });

  module.exports = {
    gmailTransporter: gmailTransporter,
  };
}
