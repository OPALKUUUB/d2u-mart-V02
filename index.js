const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const app = express();
const multer = require("multer");
var fs = require("fs");
const adminRoutes = require("./routes/admin");
const otherRoutes = require("./routes/other");
const userRoutes = require("./routes/user");
const conn = require("./configs/connection");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'

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

app.get("/database/test", (req, res) => {
  const conn2 = mysql.createConnection({
    host: "d2u.co.th",
    user: "delivery_root",
    password: "Opal_ku79",
    database: "delivery_2u",
  });
  conn2.connect((err) => {
    if (err) {
      res.status(400).json({ status: false, message: err });
    } else {
      res.status(200).json({ status: true, message: "Connecting" });
    }
  });
});

app.use(adminRoutes);

app.use(otherRoutes);

app.use(userRoutes);

app.patch("/api/admin/check1/tracking", (req, res) => {
  const sql = "UPDATE trackings SET check1 = ? WHERE id = ?;";
  conn.query(sql, [req.body.check, req.body.id], (err, result) => {
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
});
app.patch("/api/admin/check2/tracking", (req, res) => {
  const sql = "UPDATE trackings SET check2 = ? WHERE id = ?;";
  conn.query(sql, [req.body.check, req.body.id], (err, result) => {
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
        message: "update trackings at check2 successfully",
      });
    }
  });
});

app.patch("/api/admin/yahoo/tracking", (req, res) => {
  let date = genDate();
  const tracking = [
    date,
    req.body.track_id,
    req.body.box_id,
    req.body.weight,
    req.body.round_boat,
    req.body.id,
  ];
  const sql =
    "UPDATE orders SET updated_at = ?, track_id = ?, box_id = ?, weight = ?, round_boat = ? WHERE id = ?;";
  conn.query(sql, tracking, (err, result) => {
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
        message: "update successful",
      });
    }
  });
});

// tracking

app.get("/api/tracking", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: "Your login session is expired,\nPlease Sign In Again!",
          error: "jwt",
        });
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    const sql = "SELECT * FROM trackings WHERE username = ?;";
    conn.query(sql, [decoded.username], (err, row) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
          error: "sql",
        });
      } else {
        const sql2 =
          "SELECT id,username, track_id, box_id, weight, round_boat, imgsrc, created_at FROM orders WHERE username = ? AND payment_status = ?;";
        conn.query(sql2, [decoded.username, "paid"], (err2, row2) => {
          if (err2) {
            console.log(err);
            res.status(400).json({
              status: false,
              message: "Error: " + err2.sqlMessage,
              error: "sql",
            });
          } else {
            for (let i = 0; i < row2.length; i++) {
              row2[i].channel = "yahoo";
            }
            row.push(...row2);
            res.status(200).json({
              status: true,
              message: "Select tracking successfull",
              data: row,
            });
          }
        });
      }
    });
  }
});

app.get("/api/admin/track/:mode", (req, res) => {
  let track = [req.params.mode];
  let sql = `SELECT * FROM trackings 
    WHERE channel = ? `;
  console.log(req.query);
  if (req.query.check1 === "true") {
    sql += ` AND check1 = 1 `;
  } else if (req.query.check1 === "false") {
    sql += ` AND (check1 = 0 OR check1 IS NULL) `;
  }
  if (req.query.check2 === "true") {
    sql += ` AND check2 = 1 `;
  } else if (req.query.check2 === "false") {
    sql += ` AND (check2 = 0 OR check2 IS NULL) `;
  }
  if (req.query.date !== "") {
    sql += ` AND created_at LIKE ? `;
    track.push(req.query.date + "%");
  }
  if (req.query.username !== "") {
    let username = req.query.username + "%";
    sql += ` AND username LIKE ? `;
    track.push(username);
  }
  if (req.query.trackId !== "") {
    let trackId = req.query.trackId;
    if (trackId[0] === "/") {
      if (trackId.length > 1) {
        sql += ` AND track_id LIKE ? `;
        trackId = "%" + trackId.slice(1);
        track.push(trackId);
      }
    } else {
      trackId += "%";
      sql += ` AND track_id LIKE ? `;
      track.push(trackId);
    }
  }
  if (req.query.roundBoat !== "") {
    sql += ` AND round_boat = ? `;
    track.push(req.query.roundBoat);
  }

  let orderBy = req.query.orderBy;
  if (orderBy === "ASC1") {
    sql += " ORDER BY created_at ASC;";
  } else if (orderBy === "DESC1") {
    sql += " ORDER BY created_at DESC;";
  } else if (orderBy === "ASC2") {
    sql += " ORDER BY round_boat ASC;";
  } else if (orderBy === "DESC2") {
    sql += " ORDER BY round_boat DESC;";
  }

  conn.query(sql, track, (err, row) => {
    if (err) {
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        data: row,
      });
    }
  });
});

app.delete("/api/admin/tracking", (req, res) => {
  const sql = "DELETE FROM trackings WHERE id = ?;";
  conn.query(sql, [req.body.id], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "delete tracking successfully!",
      });
    }
  });
});

app.post("/api/admin/tracking/:mode", (req, res) => {
  let date = genDate();
  let tracking = [
    req.body.url,
    req.body.box_id,
    req.params.mode,
    req.body.date,
    req.body.username,
    req.body.track_id,
    req.body.weight,
    req.body.round_boat,
    req.body.remark,
    req.body.pic1_filename,
    req.body.pic2_filename,
    date,
    date,
  ];
  let sql =
    "INSERT INTO trackings (url,box_id,channel,date,username,track_id,weight,round_boat,remark,pic1_filename,pic2_filename, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";
  conn.query(sql, tracking, (err, result) => {
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
        message: "add data in trackings success!",
      });
    }
  });
});

app.patch("/api/admin/tracking", (req, res) => {
  let date = genDate();
  let tracking = [
    req.body.url,
    req.body.box_id,
    req.body.channel,
    req.body.date,
    req.body.username,
    req.body.track_id,
    req.body.weight,
    req.body.round_boat,
    req.body.pic1_filename,
    req.body.pic2_filename,
    req.body.remark,
    date,
    req.body.id,
  ];
  const sql =
    "UPDATE trackings SET url = ?, box_id = ?,channel =?,date = ?, username = ?, track_id = ?, weight = ?, round_boat = ?, pic1_filename = ?, pic2_filename = ?, remark = ?, updated_at = ? WHERE id = ?;";
  conn.query(sql, tracking, (err, result) => {
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
        message: "Update trackings * where id = " + req.body.id,
      });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".csv");
  },
});

const upload = multer({ storage: storage });
const csv = require("csv-parser");

app.post("/api/admin/read/csv", upload.single("file"), (req, res) => {
  let results = [];
  console.log(req.file);
  fs.createReadStream("uploads/" + req.file.filename)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.status(200).json({
        data: results,
      });
    });
});

function dmy2ymd(date) {
  const re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  if (re.test(date)) {
    let t = [];
    if (date[2] === "-" || date[1] === "-") {
      t = date.split("-");
    } else if (date[2] === "/" || date[1] === "/") {
      t = date.split("/");
    } else {
      return null;
    }
    let m = t[1].length === 1 ? `0${t[1]}` : t[1];
    let d = t[0].length === 1 ? `0${t[0]}` : t[0];
    return t[2] + "-" + m + "-" + d;
  }
  return null;
}

app.post("/api/admin/csv/shimizu", (req, res) => {
  let date = genDate();
  let tracking = [
    req.body.data[0].box_id,
    "shimizu",
    dmy2ymd(req.body.data[0].date),
    req.body.data[0].username,
    req.body.data[0].track_id,
    req.body.data[0].weight,
    dmy2ymd(req.body.data[0].round_boat),
    req.body.data[0].remark,
    date,
    date,
  ];
  let sql =
    "INSERT INTO trackings (box_id,channel,date,username,track_id,weight,round_boat,remark, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)";
  for (let i = 1; i < req.body.data.length; i++) {
    sql += ",(?,?,?,?,?,?,?,?,?,?)";
    tracking.push(req.body.data[i].box_id);
    tracking.push("shimizu");
    tracking.push(dmy2ymd(req.body.data[i].date));
    tracking.push(req.body.data[i].username);
    tracking.push(req.body.data[i].track_id);
    tracking.push(req.body.data[i].weight);
    tracking.push(dmy2ymd(req.body.data[i].round_boat));
    tracking.push(req.body.data[i].remark);
    tracking.push(date);
    tracking.push(date);
  }
  conn.query(sql, tracking, (err, result) => {
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
        message: "add data in trackings success!",
      });
    }
  });
});

// Project point acculate
app.patch("/api/admin/point", (req, res) => {
  let sql = `UPDATE user_customers SET point_old = ?, point_new = ? WHERE username = ?;`;
  conn.query(
    sql,
    [req.body.point_old, req.body.point_new, req.body.username],
    (err, result) => {
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
          message: "update point successfully!",
        });
      }
    }
  );
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// ref deploy : https://daveceddia.com/deploy-react-express-app-heroku/
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
