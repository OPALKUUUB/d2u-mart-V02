const https = require("https");
const express = require("express");
const path = require("path");

const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
const multer = require("multer");
var request = require("request");
dotenv.config();
// const PD_SRC_IMAGE = "./client/public/slip/";
// const PD_SRC_IMAGE_TRACKING = "./client/public/image/";
let PD_SRC_IMAGE = "./client/build/slip/";
let PD_SRC_IMAGE_TRACKING = "./client/build/image/";
// PD_SRC_IMAGE = "./client/public/slip/";
// PD_SRC_IMAGE_TRACKING = "./client/public/image/";
const TOKEN = process.env.LINE_ACCESS_TOKEN;

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'
function genToken(username) {
  return jwt.sign({ username: username }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
}

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

app.get("/", (req, res) => {
  res.send("test");
});

//  this section for line api
app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === "message") {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: "Hello, user",
        },
        {
          type: "text",
          text: "May I help you?",
        },
      ],
    });

    // Request header
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    // Options to pass into the request
    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    // Define request
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    // Handle error
    request.on("error", (err) => {
      console.error(err);
    });

    // Send data
    request.write(dataString);
    request.end();
  }
});

app.get("/api/regist", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
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
});
app.post("/api/regist", (req, res) => {
  var date = genDate();
  var regist = [
    req.body.username,
    req.body.name,
    req.body.phone,
    req.body.case,
    req.body.address,
    req.body.password,
    date,
    date,
  ];
  const sql = `INSERT INTO user_customers (
      username,name,phone,address_case,address,password,created_at,updated_at
      ) VALUES(?,?,?,?,?,?,?,?);`;
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
});
app.patch("/api/regist", (req, res) => {
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
  const sql = `UPDATE user_customers SET 
      username = ?,name =?,phone =?,address_case =?,address =?,password =?,updated_at =?
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
});

app.post("/api/yen", (req, res) => {
  const sql = "UPDATE config SET yen=? WHERE id = ?";
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
});

app.get("/api/yen", (req, res) => {
  const sql = "SELECT * FROM config WHERE id = 1;";
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
});
app.post("/api/regist", (req, res) => {
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
  const sql = `INSERT INTO user_customers (
      username,
      name,
      phone,
      address_case,
      address,
      password,
      created_at,
      updated_at
      ) VALUES(?,?,?,?,?,?,?,?);`;
  conn.query(sql, regist, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(result);
      if (!IsEmpty(result.insertId)) {
        res.status(200).json({
          status: true,
          message:
            "insert into usercustomers is successfully at row " +
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
});

app.post("/api/login", (req, res) => {
  const { username, password, mode } = req.body;
  let sql = "";
  if (mode === 1) {
    sql = "SELECT password FROM user_admins WHERE username = ?;";
  } else {
    sql = "SELECT password FROM user_customers WHERE username = ?;";
  }

  conn.query(sql, [username], (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      console.log(row);
      if (row.length === 0) {
        res.status(400).json({
          status: false,
          message: "Username is not Register yet!",
        });
      } else {
        if (row[0].password === password) {
          var token = genToken(username);
          res.status(200).json({
            status: true,
            message: "Login is successfully!",
            token: token,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Username or Password is not correct!",
          });
        }
      }
    }
  });
});

app.post("/api/yahoo/image", (req, res) => {
  // ref: https://stackoverflow.com/questions/31553682/regex-extract-img-src-javascript
  request(req.body.link, function (error, response, body) {
    if (error) {
      res.status(400).json({
        status: false,
        message: "Error: " + error,
      });
    } else {
      const sources = body
        .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));
      res.status(200).json({
        status: true,
        imgsrc: sources[2],
      });
    }
  });
});

app.post("/api/yahoo/offer", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let date = genDate();
    let offer = [
      decoded.username,
      req.body.link,
      req.body.imgsrc,
      req.body.price,
      "Auction",
      req.body.remark,
      date,
      date,
    ];
    console.log(offer);
    const sql =
      "INSERT INTO orders (username, link, imgsrc, maxbid, status, remark, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?);";
    conn.query(sql, offer, (err, result) => {
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
          message: "Offer " + req.body.link + "is successfully",
        });
      }
    });
  }
});

app.get("/api/yahoo/orders", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    const sql = "SELECT * FROM orders WHERE username = ? and status = ?;";
    conn.query(sql, [decoded.username, "Auction"], (err, row) => {
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
          message: "Select from orders is successfully",
          data: row,
        });
      }
    });
  }
});

app.get("/api/yahoo/payment", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    const sql =
      "SELECT * FROM orders WHERE username = ? and (payment_status = ? OR payment_status = ? OR payment_status = ?);";
    conn.query(
      sql,
      [decoded.username, "pending1", "pending2", "pending3"],
      (err, row) => {
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
            message: "Select from orders is successfully",
            data: row,
          });
        }
      }
    );
  }
});

app.patch("/api/yahoo/order/addbid", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let date = genDate();
    let sql = "";
    if (req.body.mode === 1) {
      sql =
        "UPDATE orders SET addbid1 = ?, updated_at = ? WHERE username = ? and id = ?;";
    } else {
      sql =
        "UPDATE orders SET addbid2 = ?, updated_at = ? WHERE username = ? and id = ?;";
    }
    conn.query(
      sql,
      [req.body.addbid, date, decoded.username, req.body.id],
      (err, result) => {
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
              "Update orders at username " + decoded.username + " successfully",
          });
        }
      }
    );
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ./client/public/image/
    cb(null, PD_SRC_IMAGE);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "file-" +
        Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});
const upload = multer({ storage: storage });
app.patch("/api/upload/slip", upload.single("image"), (req, res) => {
  res.status(200).json({
    status: true,
    message: "upload successfully!",
    slip_image_filename: req.file.filename,
  });
});

app.patch("/api/payment/confirm", (req, res) => {
  var decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: " + err);
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let sql = "INSERT INTO payments (price, slip_image_filename) VALUES (?,?);";
    conn.query(
      sql,
      [req.body.price, req.body.slip_image_filename],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(400).json({
            status: false,
            message: "Error: " + err.sqlMessage,
          });
        } else {
          console.log("insertId: " + result.insertId);
          let paymentId = req.body.paymentId;
          sql =
            "UPDATE orders SET payment_id = ?, payment_status = ? WHERE id = ?";
          for (let i = 0; i < paymentId.length - 1; i++) {
            sql += " OR id=?";
          }
          sql += ";";
          conn.query(
            sql,
            [result.insertId, "pending3", ...paymentId],
            (err1, result1) => {
              if (err1) {
                console.log(err1.sqlMessage);
                res.status(400).json({
                  status: false,
                  message: "Error: " + err1.sqlMessage,
                });
              } else {
                console.log(result1);
                res.status(200).json({
                  status: true,
                  message: "created payment successfully!",
                });
              }
            }
          );
        }
      }
    );
  }
});

app.get("/api/payment/slip/:id", (req, res) => {
  const sql = "SELECT slip_image_filename FROM payments WHERE id = ?;";
  conn.query(sql, [req.params.id], (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "select slip filename where payment_id = " + req.params.id,
        data: row[0].slip_image_filename,
      });
    }
  });
});

app.get("/api/yahoo/history", (req, res) => {
  var decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: " + err);
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    const sql =
      "SELECT * FROM orders WHERE username = ? AND (payment_status = ? OR status = ?);";
    conn.query(sql, [decoded.username, "paid", "lose"], (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
        });
      } else {
        // console.log(result);
        res.status(200).json({
          status: true,
          message:
            "Select data from order that status 'Auction' username: " +
            decoded.username,
          data: result,
        });
      }
    });
  }
});

// Admin
app.get("/api/admin/users", (req, res) => {
  const sql = "SELECT * FROM user_customers;";
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
});
app.get("/api/admin/yahoo/auction", (req, res) => {
  const sql = "SELECT * FROM orders WHERE status = ?";
  conn.query(sql, ["Auction"], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      // console.log(result);
      res.status(200).json({
        status: true,
        message: "Select data from order that status 'Auction'",
        data: result,
      });
    }
  });
});
app.get("/api/admin/yahoo/payment", (req, res) => {
  const sql =
    "SELECT * FROM orders WHERE payment_status = ? OR payment_status = ? OR payment_status = ?;";
  conn.query(sql, ["pending1", "pending2", "pending3"], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      // console.log(result);
      res.status(200).json({
        status: true,
        message: "Select data from order that status 'Auction'",
        data: result,
      });
    }
  });
});
app.get("/api/admin/yahoo/history", (req, res) => {
  const sql = "SELECT * FROM orders WHERE payment_status = ? OR status = ?;";
  conn.query(sql, ["paid", "lose"], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      // console.log(result);
      res.status(200).json({
        status: true,
        message: "Select data from order that status 'Auction'",
        data: result,
      });
    }
  });
});

app.patch("/api/admin/workby", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let date = genDate();
    let value = req.body.value ? null : decoded.username;
    let sql = "";
    if (req.body.mode === 1) {
      sql =
        "UPDATE orders SET maxbid_work_by = ?, updated_at = ? WHERE id = ?;";
    } else if (req.body.mode === 2) {
      sql =
        "UPDATE orders SET addbid1_work_by = ?, updated_at = ? WHERE id = ?;";
    } else if (req.body.mode === 3) {
      sql =
        "UPDATE orders SET addbid2_work_by = ?, updated_at = ? WHERE id = ?;";
    }
    conn.query(sql, [value, date, req.body.id], (err, result) => {
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
            "Update orders at maxbid_work_by " +
            decoded.username +
            " successfully",
          value: value,
        });
      }
    });
  }
});

app.patch("/api/admin/win", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let date = genDate();
    let win = [
      decoded.username,
      "win",
      req.body.bid,
      req.body.tranferFee,
      req.body.deliveryFee,
      req.body.paymentStatus,
      date,
      req.body.id,
    ];

    let sql =
      "UPDATE orders SET bid_by=?,status = ?,bid =?, tranfer_fee_injapan =?, delivery_in_thai =?, payment_status=?, updated_at = ? WHERE id = ?;";
    conn.query(sql, win, (err, result) => {
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
          message: "Update orders at orders when win auction ",
        });
      }
    });
  }
});

app.patch("/api/admin/lose", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
      } else {
        console.log(decoded);
        return decoded;
      }
    }
  );
  if (decoded !== undefined) {
    let date = genDate();
    let lose = [decoded.username, "lose", date, req.body.id];

    let sql =
      "UPDATE orders SET bid_by = ?, status = ?, updated_at = ? WHERE id = ?;";
    conn.query(sql, lose, (err, result) => {
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
          message: "Update orders at orders when lose auction ",
        });
      }
    });
  }
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
const trackingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ./client/public/image/
    cb(null, PD_SRC_IMAGE_TRACKING);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "file-" +
        Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});
const trackingUpload = multer({ storage: trackingStorage });
app.post("/api/upload", trackingUpload.single("image"), (req, res) => {
  res.status(200).json({
    filename: req.file.filename,
  });
});

app.get("/api/tracking", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
        });
        console.log("Error: Your login session is expired!");
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
        });
      } else {
        res.status(200).json({
          status: true,
          message:
            "Select * from tracking where username = " + decoded.username,
          data: row,
        });
      }
    });
  }
});

app.get("/api/admin/tracking/:mode", (req, res) => {
  const sql = "SELECT * FROM trackings WHERE channel = ?;";
  conn.query(sql, [req.params.mode], (err, row) => {
    if (err) {
      console.log(err.sqlMessage);
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

app.post("/api/admin/tracking/:mode", (req, res) => {
  let date = genDate();
  let tracking = [
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
    "INSERT INTO trackings (box_id,channel,date,username,track_id,weight,round_boat,remark,pic1_filename,pic2_filename, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
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
    "UPDATE trackings SET box_id = ?,channel =?,date = ?, username = ?, track_id = ?, weight = ?, round_boat = ?, pic1_filename = ?, pic2_filename = ?, remark = ?, updated_at = ? WHERE id = ?;";
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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// ref deploy : https://daveceddia.com/deploy-react-express-app-heroku/
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
