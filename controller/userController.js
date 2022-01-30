//code partially taken from https://bezkoder.com/node-js-mongodb-auth-jwt/

const User = require("../model/user"),
  Token = require("../model/token"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  nodemailer = require("nodemailer"),
  { gmailTransporter } = require("../services/nodemailerService");

let secret = Math.random().toString(36).slice(-8);
// let secret = "some-secret";

module.exports = {
  checkDuplicateUsernameOrEmail: (req, res, next) => {
    const id = req.body._id || req.body.id;
    // Username
    User.findOne({
      username: req.body.username,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user && user._id != id) {
        res.status(400).send({ message: "Benutzername bereits vergeben!" });
        return;
      }
      // Email
      User.findOne({
        email: req.body.email,
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (user && user._id != id) {
          res.status(400).send({ message: "Email bereits vergeben!" });
          return;
        }
        next();
      });
    });
  },

  verifyToken: (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  },
  register: (req, res, next) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    // eslint-disable-next-line no-unused-vars
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err.message });
        return;
      } else {
        var token = new Token({
          _userId: user._id,
          token: jwt.sign({ id: user.id }, secret, {
            expiresIn: 86400, // 24 hours
          }),
        });

        token.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
        });
        res.locals.token = token;
        res.locals.user = user;
        next();
      }
    });
  },

  confirmation: (req, res) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token)
        return res.status(400).send({
          type: "not-verified",
          msg: "We were unable to find a valid token. Your token may have expired.",
        });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, function (err, user) {
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.isVerified)
          return res.status(400).send("Der Nutzer wurde bereits bestätigt.");

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send(
            "The account has been verified. Please log in: http://studyplan.f4.htw-berlin.de/login" //TODO change to https
          );
        });
      });
    });
  },

  login: (req, res) => {
    User.findOne({
      username: req.body.username,
    })
      .populate("studyPlan")
      .populate("startOfStudy")
      .then((user, err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "Nutzer nicht gefunden!" });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Falsches Passwort!",
          });
        }
        if (!user.isVerified) {
          return res.status(401).send({
            type: "not-verified",
            message:
            "Dein Account wurde noch nicht verifiziert. Überprüfe deine E-Mails oder fordere eine neue E-Mail an.",
          });
        }
        var token = jwt.sign({ id: user.id }, secret, {
          expiresIn: 86400, // 24 hours
        });
        user.accessToken = token;
        user.save();
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          startOfStudy: user.startOfStudy,
          studyPlan: user.studyPlan,
          accessToken: user.accessToken,
          password: user.password,
          isPreferred: user.isPreferred,
          isAdmin: user.isAdmin,
        });
      });
  },
  resendVerificationEmail: (req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ message: "Kein Benutzer mit dieser E-Mail-Adresse gefunden."});
      if (user.isVerified)
        return res.status(400).send({
          message: "Der Account wurde schon bestätigt. Bitte logge dich ein",
        });
      res.locals.user = user;
      // Create a verification token, save it, and send email
      var token = new Token({
        _userId: user._id,
        token: jwt.sign({ id: user.id }, secret, {
          expiresIn: 86400, // 24 hours
        }),
      });

      // Save the token
      token.save(function (err) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.locals.token = token;

        next();
      });
    });
  },
  resetPassword: (req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ message: "Kein Benutzer mit dieser E-Mail-Adresse gefunden."});
      if (!user.isVerified) {
        return res.status(401).send({
          type: "not-verified",
          message:
          "Dein Account wurde noch nicht verifiziert. Überprüfe deine E-Mails oder fordere eine neue E-Mail an.",
        });
      }
      //create a new password, save it to the user, and send it to the user in an email
      const newRandomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(newRandomPassword, 8);
      user.password = hashedPassword;
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err.message });
          return;
        } else {
          res.locals.user = user;
          res.locals.password = newRandomPassword;
          next();
        }
      });
    });
  },
  sendEmailWithNewPassword: (req, res) => {
    let transporter;
    if (process.env.NODE_ENV == "production") {
      transporter = gmailTransporter;
    } else {
      //Developmemt mode
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "helene91@ethereal.email",
          pass: "zhsd445wR7kW8whv7Z",
        },
      });
    }

    var mailOptions = {
      from: "studyplanhtwberlin@gmail.com", //TODO change email
      to: res.locals.user.email,
      subject: "New Password",
      text:
        "Hello,\n\n" +
        "This is your new password. Please update it in your profile settings soon.\n\n" +
        res.locals.password,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      if (process.env.NODE_ENV == "TEST") {
        res.status(200).send(nodemailer.getTestMessageUrl(info));
      } else {
        res
          .status(200)
          .send(
            "An email with a new password has been sent to " +
              res.locals.user.email +
              "."
          );
      }
    });
  },
  sendVerificationEmail: (req, res) => {
    // Send the email
    let transporter;
    if (process.env.NODE_ENV == "production") {
      transporter = gmailTransporter;
    } else {
      //Developmemt mode
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "helene91@ethereal.email",
          pass: "zhsd445wR7kW8whv7Z",
        },
      });
    }

    var mailOptions = {
      from: "studyplanhtwberlin@gmail.com", //TODO change email
      to: res.locals.user.email,
      subject: "Account Verification Token",
      text:
        "Hello,\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/users/confirmation/" +
        res.locals.token.token,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      if (process.env.NODE_ENV == "TEST") {
        res.status(200).send(nodemailer.getTestMessageUrl(info));
      } else {
        res
          .status(200)
          .send(
            "E-Mail mit Verifikationslink gesendet an: " +
              res.locals.user.email
          );
      }
    });
  },
  update: async (req, res) => {
    let userParams = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      startOfStudy: req.body.startOfStudy,
      studyPlan: req.body.studyPlan,
      courseSelection: req.body.courseSelection,
      accessToken: req.body.accessToken,
      isPreferred: req.body.isPreferred,
    };
    console.log(userParams);
    User.findByIdAndUpdate(req.params.id, { $set: userParams }, { new: true })
      .populate("studyPlan")
      .populate("courseSelection")
      .populate("startOfStudy")
      .then((user, err) => {
        if (err) console.log(err.message);
        else {
          return res.json(user);
        }
      });
  },
  updatePassword: async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = bcrypt.hashSync(req.body.newPassword, 8);

    //find user and compare old password that is stored to this oldPassword
    const user = await User.findById(req.params.id);
    var passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (passwordIsValid) {
      User.findByIdAndUpdate(
        req.params.id,
        { $set: { password: newPassword } },
        { new: true }
      )
        .populate("studyPlan")
        .populate("startOfStudy")
        .then((user, err) => {
          if (err) console.log(err.message);
          else {
            res.send({ message: "Passwort wurde erfolgreich aktualisiert!" });
          }
        });
    } else {
      return res
        .status(500)
        .send({ message: "Altes Passwort ist nicht korrekt!" });
    }
  },
};
