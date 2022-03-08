const conn = require("../configs/connection");
const jwt = require("jsonwebtoken");

function genToken(username) {
  return jwt.sign({ username: username }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
}

exports.login = (req, res) => {
  const { username, password, mode } = req.body;
  let sql = "";
  if (mode === 1) {
    sql = "SELECT password FROM user_admins WHERE username = ?;";
  } else {
    sql = "SELECT password FROM user_customers WHERE username = ?;";
  }
  conn.query(sql, [username], (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(row);
      if (row.length === 0) {
        res.status(400).json({
          status: false,
          message: "Username is not Register yet!",
        });
      } else {
        if (row[0].password === password) {
          var token = genToken(username);
          res.status(200).json({
            status: true,
            message: "Login is successfully!",
            token: token,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Username or Password is not correct!",
          });
        }
      }
    }
  });
};
