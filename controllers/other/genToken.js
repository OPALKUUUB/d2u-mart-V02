const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function (username, id) {
  console.log("Token of : " + username);
  return jwt.sign({ username: username, id: id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};
