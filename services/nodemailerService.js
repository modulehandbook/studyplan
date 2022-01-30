const nodemailer = require("nodemailer");

let secrets = null;
if (process.env.TEST_PROD == "true" || process.env.NODE_ENV != "production") {
  secrets = process.env;
} else {
  secrets = require(process.env.SECRET_PATH);
}

const user = secrets.GMAIL_USER;
const userPassword = secrets.GMAIL_PASSWORD;

if (process.env.NODE_ENV == "production") {
  const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: userPassword,
    },
  });

  module.exports = {
    gmailTransporter: gmailTransporter,
  };
}
