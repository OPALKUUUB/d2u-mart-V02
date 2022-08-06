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
const conn = require("./configs/connection");
const adminRoutes = require("./routes/admin");
const otherRoutes = require("./routes/other");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const martRoutes = require("./routes/mart");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/api/mart", async (req, res, next) => {
  if (req.headers.token === undefined) {
    res.status(400).json({
      status: false,
      message: "Your login session is expired,\nPlease Sign In Again!",
      error: "jwt",
    });
  } else {
    // console.log(req.headers.authorization);
    // let token = req.headers.authorization.split(" ")[1];
    let token = req.headers.token;
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        res.status(400).json({
          status: false,
          message: "Your login session is expired,\nPlease Sign In Again!",
          error: "jwt",
        });
      } else {
        res.locals = { username: decoded.username };
        next();
      }
    });
  }
});
// Put all API endpoints under '/api'
app.use(authRoutes);
app.use(adminRoutes);
app.use(otherRoutes);
app.use(userRoutes);
app.use(martRoutes);

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

app.get("/check/session", (req, res) => {
  const decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => decoded
  );
  console.log(decoded);
  if (decoded !== undefined) {
    res.status(200).json({
      status: true,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Your login session is expired,\nPlease Sign In Again!",
      error: "jwt",
    });
  }
});

app.patch("/update/user/point", (req, res) => {
  const sql = `
  select
  orders.username,
  orders.id as orderId,
  orders.bid,
  orders.weight,
  orders.addPoint,
  orders.point
  from orders
  inner join payments on orders.payment_id = payments.id
  where weight is not null and addPoint = 0;
  `;
  conn.query(sql, (err, row) => {
    if (err) console.log(err);
    for (let i = 0; i < row.length; i++) {
      let item = row[i];
      let id = item.orderId;
      let bid = item.bid;
      let weight = parseFloat(item.weight);
      let point_temp = bid / 2000 + weight;
      let point = Math.round(point_temp * 100) / 100;
      let sql2 = `
      update orders
      set point = ?, addPoint = 1
      where id = ?;
      `;
      let data = [point, id];
      conn.query(sql2, data, (err2, result) => {
        if (err2) console.log(err2);
        let sql3 = `
        select id, username, point_new
        from user_customers
        where username = ?;
        `;
        conn.query(sql3, [row[i].username], (err3, row3) => {
          if (err3) console.log(err3);
          if (row3.length !== 0) {
            let point_new = row3[0].point_new;
            let sql4 = `
            update user_customers
            set point_new = ?
            where id = ?;
            `;
            conn.query(
              sql4,
              [point_new + point, row3[0].id],
              (err4, result4) => {
                if (err4) {
                  res.send(err4);
                } else {
                  console.log(result4);
                }
              }
            );
          }
        });
      });
    }
    res.send("success");
  });
});

app.get("/cal/point", (req, res) => {
  const sql = `
  select 
  orders.id as orderId,
  orders.bid,
  orders.weight,
  orders.addPoint,
  orders.point
  from orders
  inner join payments on orders.payment_id = payments.id
  where weight is not null and addPoint = 0;
  `;
  conn.query(sql, (err, row) => {
    if (err) console.log(err);
    for (let i = 0; i < row.length; i++) {
      let item = row[i];
      let id = item.orderId;
      let bid = item.bid;
      let weight = parseFloat(item.weight);
      let point_temp = bid / 2000 + weight;
      let point = Math.round(point_temp * 100) / 100;
      let sql2 = `
      update orders
      set point = ?
      where id = ?;
      `;
      let data = [point, id];
      conn.query(sql2, data, (err2, result) => {
        if (err2) console.log(err2);
        console.log(result.info);
      });
      if (i === row.length - 1) {
        console.log("success");
      }
    }
    res.send("success");
  });
});

app.patch("/update/user/point/tracking", (req, res) => {
  const sql = `
  select 
  id,
  channel,
  price,
  weight,
  q,
  created_at,
  addPoint
  from trackings
  WHERE
  channel not like 'shimizu'
  and (weight != '' OR q != 0)
  AND price != '' OR price IS NOT null
  and addPoint = 0;
  `;
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err);
      res.send("Error: " + err.sqlMessage);
    } else {
      for (let i = 0; i < row.length; i++) {
        let point = 0;
        let base_point = 1000.0;
        if (row[i].channel === "123") {
          base_point = 2000.0;
        }
        let point_price = row[i].price / base_point;
        let point_weight = 0;
        if (row[i].q === 0) {
          let weight = parseFloat(row[i].weight);
          if (weight > 1) {
            point_weight = weight - 1;
          }
        } else {
          let q = parseFloat(row[i].q);
          point_weight = 100 * q;
        }

        point = point_price + point_weight;
        row[i].point = point;
        let sql2 = `
        update trackings
        set point = ?, addPoint = 1
        where id = ?;
        `;
        let data = [point, row[i].id];
        conn.query(sql2, data, (err2, result) => {
          if (err2) {
            console.log(err2);
          } else {
            let sql3 = `
        select id, username, point_new
        from user_customers
        where username = ?;
        `;
            conn.query(sql3, [row[i].username], (err3, row3) => {
              if (err3) console.log(err3);
              if (row3.length !== 0) {
                let point_new = row3[0].point_new;
                let sql4 = `
            update user_customers
            set point_new = ?
            where id = ?;
            `;
                conn.query(
                  sql4,
                  [point_new + point, row3[0].id],
                  (err4, result4) => {
                    if (err4) {
                      res.send(err4);
                    } else {
                      console.log(result4);
                    }
                  }
                );
              }
            });
          }
        });
      }
      res.json({
        data: row,
      });
    }
  });
});

app.get("/cal/point/tracking", (req, res) => {
  const sql = `
  select 
  id,
  channel,
  price,
  weight,
  q,
  created_at,
  addPoint
  from trackings
  WHERE
  channel not like 'shimizu'
  and (weight != '' OR q != 0)
  AND price != '' OR price IS NOT null
  and addPoint = 0;
  `;
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err);
      res.send("Error: " + err.sqlMessage);
    } else {
      for (let i = 0; i < row.length; i++) {
        let point = 0;
        let base_point = 1000.0;
        if (row[i].channel === "123") {
          base_point = 2000.0;
        }
        let point_price = row[i].price / base_point;
        let point_weight = 0;
        if (row[i].q === 0) {
          let weight = parseFloat(row[i].weight);
          if (weight > 1) {
            point_weight = weight - 1;
          }
        } else {
          let q = parseFloat(row[i].q);
          point_weight = 100 * q;
        }

        point = point_price + point_weight;
        row[i].point = point;
        let sql2 = `
        update trackings
        set point = ?
        where id = ?;
        `;
        let data = [point, row[i].id];
        conn.query(sql2, data, (err2, result) => {
          if (err2) console.log(err2);
          console.log(result.info);
        });
      }
      res.json({
        data: row,
      });
    }
  });
});

app.patch("/update/user/point/tracking/shimizu", (req, res) => {
  const sql = `
  select 
  id,
  channel,
  weight,
  q,
  created_at,
  addPoint
  from trackings
  WHERE
  channel like 'shimizu'
  and (weight != '' OR q != 0)
  and addPoint = 0
  ;`;
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err);
      res.send("Error: " + err.sqlMessage);
    } else {
      for (let i = 0; i < row.length; i++) {
        let point = 0;
        if (row[i].q === 0) {
          point = parseFloat(row[i].weight);
        } else {
          point = parseFloat(row[i].q * 100);
        }
        row[i].point = point;
        let sql2 = `
        update trackings
        set point = ?, addPoint = 1
        where id = ?;
        `;
        let data = [point, row[i].id];
        conn.query(sql2, data, (err2, result) => {
          if (err2) {
            console.log(err2);
          } else {
            let sql3 = `
        select id, username, point_new
        from user_customers
        where username = ?;
        `;
            conn.query(sql3, [row[i].username], (err3, row3) => {
              if (err3) console.log(err3);
              if (row3.length !== 0) {
                let point_new = row3[0].point_new;
                let sql4 = `
            update user_customers
            set point_new = ?
            where id = ?;
            `;
                conn.query(
                  sql4,
                  [point_new + point, row3[0].id],
                  (err4, result4) => {
                    if (err4) {
                      res.send(err4);
                    } else {
                      console.log(result4);
                    }
                  }
                );
              }
            });
          }
        });
      }
      res.json({
        data: row,
      });
    }
  });
});
app.get("/cal/point/tracking/shimizu", (req, res) => {
  const sql = `
  select 
  id,
  channel,
  weight,
  q,
  created_at,
  addPoint
  from trackings
  WHERE
  channel like 'shimizu'
  and (weight != '' OR q != 0)
  and addPoint = 0
  ;`;
  conn.query(sql, (err, row) => {
    if (err) {
      console.log(err);
      res.send("Error: " + err.sqlMessage);
    } else {
      for (let i = 0; i < row.length; i++) {
        let point = 0;
        if (row[i].q === 0) {
          point = parseFloat(row[i].weight);
        } else {
          point = parseFloat(row[i].q * 100);
        }
        row[i].point = point;
        let sql2 = `
        update trackings
        set point = ?
        where id = ?;
        `;
        let data = [point, row[i].id];
        conn.query(sql2, data, (err2, result) => {
          if (err2) console.log(err2);
          console.log(result.info);
        });
      }
      res.json({
        data: row,
      });
    }
  });
});

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
    let username = "%" + req.query.username + "%";
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
    req.params.mode === "shimizu" ? 0 : req.body.price,
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
    "INSERT INTO trackings (url,price,box_id,channel,date,username,track_id,weight,round_boat,remark,pic1_filename,pic2_filename, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
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
    req.body.q,
    req.body.channel === "shimizu"
      ? 0
      : req.body.price === ""
      ? 0
      : req.body.price,
    req.body.round_boat,
    req.body.pic1_filename,
    req.body.pic2_filename,
    req.body.remark,
    date,
    req.body.id,
  ];
  console.log(tracking);
  const sql =
    "UPDATE trackings SET url = ?, box_id = ?,channel =?,date = ?, username = ?, track_id = ?, weight = ?, q=?, price = ?, round_boat = ?, pic1_filename = ?, pic2_filename = ?, remark = ?, updated_at = ? WHERE id = ?;";
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
