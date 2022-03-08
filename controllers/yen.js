const conn = require("../configs/connection");

exports.patchYen = (req, res) => {
  const sql = `
  UPDATE config
  SET yen = ?
  WHERE id = ?`;
  conn.query(sql, [req.body.yen, 1], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(result);
      res
        .status(200)
        .json({ status: true, message: "update yen successfully!" });
    }
  });
};

exports.getYen = (req, res) => {
  const sql = `
  SELECT * FROM config
  WHERE id = 1;`;
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(row);
      res.status(200).json({
        status: true,
        message: "Select * from config is successfully",
        yen: row[0].yen,
      });
    }
  });
};
