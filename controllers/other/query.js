const { conn, createConn } = require("./connection");

module.exports = function (sql, data) {
  return new Promise((resolve, reject) => {
    conn.connect(function (err) {
      if (err) {
        conn = createConn();
        console.log("Reconnected 😎😎😎");
      }
    });
    conn.query(sql, data, (err, rows) => {
      if (err) return reject(err);
      return resolve(rows);
    });
  });
};
