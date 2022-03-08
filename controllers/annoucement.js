const conn = require("../configs/connection");
const jwt = require("jsonwebtoken");

function jwtVerify(token) {
  let decoded = jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      res.status(400).json({
        status: false,
        message: "Your login session is expired,\nPlease Sign In Again!",
        error: "jwt",
      });
    } else {
      console.log(decoded);
      return decoded;
    }
  });
  return decoded;
}

exports.getAnnoucement = (req, res, next) => {
  const decoded = jwtVerify(req.headers.token);
  if (decoded !== undefined) {
    const sql = `SELECT annoucement FROM user_admins WHERE username = ?;`;
    conn.query(sql, [decoded.username], (err, result) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: "fail to get that user want to show annoucement or not",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Success to get that user want to show annoucement or not",
          annoucement: result[0].annoucement,
        });
      }
    });
  }
};

exports.patchAnnoucement = (req, res, next) => {
  const decoded = jwtVerify(req.headers.token);
  if (decoded !== undefined) {
    const sql = "UPDATE user_admins SET annoucement = ? WHERE username = ?;";
    conn.query(sql, [0, decoded.username], (err, result) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: "update annoucement fail",
          error: "sql",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "update successful",
        });
      }
    });
  }
};
