const conn = require("../configs/connection");

function isUndefined(obj) {
  return obj === void 0;
}

// app.post("/api/admin/track/v2/:mode", );
exports.filterTracking = (req, res) => {
  let track = [
    req.params.mode,
    req.body.date === "" ? "%" : `%${req.body.date}%`,
    req.body.username === "" ? "%" : `%${req.body.username}%`,
    req.body.trackId === "" ? "%" : `%${req.body.trackId}%`,
    req.body.roundBoat === "" ? "%" : `%${req.body.roundBoat}%`,
    isUndefined(req.query.offset) ? 0 : parseInt(req.query.offset),
    isUndefined(req.query.item) ? 0 : parseInt(req.query.item),
  ];
  let sql = `
  SELECT *
  FROM trackings
  WHERE channel = ?
  AND date like ?
  AND username like ?
  AND track_id like ?
  AND round_boat like ?
  `;
  if (req.body.orderBy === "0") {
    sql += `ORDER BY created_at DESC
    LIMIT ?, ?;
    `;
  } else if (req.body.orderBy === "1") {
    sql += `
    AND created_at != ''
    ORDER BY id ASC
    LIMIT ?, ?;
    `;
  } else if (req.body.orderBy === "2") {
    sql += `ORDER BY round_boat DESC
    LIMIT ?, ?;
    `;
  } else if (req.body.orderBy === "3") {
    sql += `
    AND round_boat != ''
    ORDER BY round_boat ASC
    LIMIT ?, ?;
    `;
  } else {
    sql += `ORDER BY id DESC
    LIMIT ?, ?;
    `;
  }
  // limit(offset, item) || limit(top)
  conn.query(sql, track, (err, row) => {
    if (err) throw err;
    console.log(row.length);
    res.status(200).json({
      data: row,
    });
  });
};

// app.patch("/api/admin/track/v2/check/:ckmode", );
exports.setCheck = (req, res) => {
  let sql;
  if (req.params.ckmode === "1") {
    sql = `
    UPDATE trackings SET
    check1 = ?
    WHERE id = ?;`;
  } else if (req.params.ckmode === "2") {
    sql = `
    UPDATE trackings SET
    check2 = ?
    WHERE id = ?;`;
  }
  let data = [req.body.check, req.body.id];
  console.log(data);
  conn.query(sql, data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(result);
      res.status(200).json({
        status: true,
        message: "update trackings at check1 successfully",
      });
    }
  });
};
