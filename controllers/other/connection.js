const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
let conn;
function createConn() {
  return mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    multipleStatements: true,
  });
}

function handleError() {
  conn = createConn();
  conn.connect((err) => {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleError, 2000);
    } else {
      console.log("Connected 😎😎😎");
      return conn;
    }
  });
  conn.on("error", function (err) {
    console.log("db error", err);
    // If the connection is disconnected, automatically reconnect
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleError();
    } else {
      throw err;
    }
  });
}
handleError();

module.exports = { conn, handleError, createConn };
