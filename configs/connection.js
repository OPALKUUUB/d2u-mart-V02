const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// const conn = mysql.createConnection({
//   host: process.env.PD_DB_HOST,
//   user: process.env.PD_DB_UNAME,
//   password: process.env.PD_DB_PS,
//   database: process.env.PD_DB_DBNAME,
//   port: process.env.PD_DB_PORT,
// });
const conn = mysql.createConnection(
  "mysql://doadmin:AVNS_0LUkx5D8NemFW9z@d2u-service-do-user-10838728-0.b.db.ondigitalocean.com:25060/xfs8on6zzxllsel9?ssl-mode=REQUIRED"
);
conn.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Connected!");
});

module.exports = conn;
