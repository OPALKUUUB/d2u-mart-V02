const conn = require("../configs/connection");
const jwt = require("jsonwebtoken");

function genDate() {
  let today = new Date();
  let date = today.getDate() >= 10 ? today.getDate() : `0${today.getDate()}`;
  let month =
    today.getMonth() >= 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  let hour = today.getHours() >= 10 ? today.getHours() : `0${today.getHours()}`;
  let minute =
    today.getMinutes() >= 10 ? today.getMinutes() : `0${today.getMinutes()}`;
  return `${today.getFullYear()}-${month}-${date}T${hour}:${minute}`;
}

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

exports.getUserProfile = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
  if (decoded !== undefined) {
    const sql = "SELECT * FROM user_customers WHERE username = ?;";
    conn.query(sql, [decoded.username], (err, row) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(400).json({
          status: 400,
          message: "Error: " + err.sqlMessage,
        });
      } else {
        res.status(200).json({
          status: true,
          message:
            "select * from user_customers where username = " +
            decoded.username +
            " successfully!",
          data: row[0],
        });
      }
    });
  }
};

exports.patchUserProfile = (req, res) => {
  var date = genDate();
  var regist = [
    req.body.username,
    req.body.name,
    req.body.phone,
    req.body.address_case,
    req.body.address,
    req.body.password,
    date,
    req.body.id,
  ];
  const sql = `
  UPDATE user_customers
  SET username = ?, name = ?, phone = ?, address_case = ?, address = ?, password = ?, updated_at = ?
  WHERE id = ?;`;
  conn.query(sql, regist, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(result);
      res.status(200).json({
        status: true,
        message:
          "insert into user_customers is successfully at row " +
          result.insertId,
      });
    }
  });
};

exports.userRegister = (req, res) => {
  var date = genDate();
  var regist = [
    req.body.username,
    req.body.name,
    req.body.phone,
    req.body.address_case,
    req.body.address,
    req.body.password,
    date,
    date,
  ];
  const sql = `
  INSERT INTO user_customers
  ( username, name, phone, address_case, address, password, created_at, updated_at )
  VALUES( ?,?,?,?,?,?,?,? );`;
  conn.query(sql, regist, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(result);
      if (result.insertId > 0) {
        res.status(200).json({
          status: true,
          message:
            "insert into user customers is successfully at row " +
            result.insertId,
        });
      } else {
        res.status(400).json({
          status: false,
          message: result,
        });
      }
    }
  });
};

exports.getUsername = (req, res) => {
  const sql = "SELECT username FROM user_customers;";
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "select * from user_customers",
        data: row,
      });
    }
  });
};

exports.filterUsername = (req, res) => {
  const sql = `
  SELECT id, created_at, username, name, phone, address, point_old, point_new, contact FROM user_customers
  WHERE username LIKE ? ORDER BY created_at DESC;`;
  conn.query(sql, [req.query.username + "%"], (err, row) => {
    if (err) {
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "select * from user_customers",
        data: row,
      });
    }
  });
};
exports.updateUser = (req, res) => {
  const user = [
    req.body.username,
    req.body.name,
    req.body.phone,
    req.body.address,
    req.body.contact,
    req.body.id,
  ];
  console.log(user);
  const sql = `
  UPDATE user_customers SET username = ?, name = ?, phone = ?, address = ?, contact = ? WHERE id = ?;`;
  conn.query(sql, user, (err, row) => {
    if (err) {
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "update user_customers",
      });
    }
  });
};
