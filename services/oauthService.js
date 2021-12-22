const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");

const clientID = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectURL = process.env.OAUTH_REDIRECT_URL;
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

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
      user: "studyplanhtwberlin@gmail.com", //TODO: change email
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
