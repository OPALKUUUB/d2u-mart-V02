const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const conn = mysql.createConnection({
  host: process.env.PD_DB_HOST,
  user: process.env.PD_DB_UNAME,
  password: process.env.PD_DB_PS,
  database: process.env.PD_DB_DBNAME,
  port: process.env.PD_DB_PORT,
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = conn;
