const User = require("../../model/user.js");
const bcrypt = require("bcryptjs");

module.exports.load = async () => {
  const userData = [
    new User({
      username: "test_username",
      password: bcrypt.hashSync("test_password", 8),
      email: "test@mail.de",
      isVerified: true,
    }),
    new User({
      username: "test_username2",
      password: bcrypt.hashSync("test_password2", 8),
      email: "test@mail.de2",
      isVerified: false,
    }),
  ];

  await User.create(userData).catch((err) => {
    throw err;
  });
};
