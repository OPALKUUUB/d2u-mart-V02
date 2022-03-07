const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
const multer = require("multer");
var fs = require("fs");
var request = require("request");
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'
function genToken(username) {
  return jwt.sign({ username: username }, process.env.SECRET_KEY, {
    expiresIn: "7d",
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

const url_line_notification = "https://notify-api.line.me/api/notify";

// This API FOR Config Yen
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

// Find image Yahoo Auction
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

// This API FOR Profile.js
// USER CUSTOMER
app.get("/api/user/customer", (req, res) => {
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
app.patch("/api/user/customer", (req, res) => {
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
app.post("/api/user/customer", (req, res) => {
  // Use in register
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
// End of manage user_customers

// AUCTION YAHOO
app.get("/api/yahoo/order", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        console.log(error);
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
    const sql = "SELECT * FROM orders WHERE username = ? and status = ?;";
    conn.query(sql, [decoded.username, "Auction"], (err, row) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
          error: "sql",
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
app.post("/api/yahoo/order", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        res.status(400).json({
          status: false,
          message: "Error: " + error.sqlMessage,
          error: "jwt",
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
          error: "sql",
        });
      } else {
        console.log(result);
        res.status(200).json({
          status: true,
          message: "Offer " + req.body.link + "is successfully",
        });
        // ref: https://somnuekmueanprasan.medium.com/line-notify-nodejs-1feb050c1016
        request(
          {
            method: "POST",
            uri: url_line_notification,
            header: {
              "Content-Type": "multipart/form-data",
            },
            auth: {
              bearer: process.env.TOKEN,
            },
            form: {
              message: `\nUsername: ${decoded.username}\nOffer Link: ${req.body.link}\nBiding: ${req.body.price} ¥`,
            },
          },
          (err, httpResponse, body) => {
            if (err) {
              console.log(err);
            } else {
              console.log(body);
            }
          }
        );
      }
    });
  }
});
app.patch("/api/yahoo/order/addbid", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          status: false,
          message: error,
          error: "jwt",
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
            error: "sql",
          });
        } else {
          console.log(result);
          res.status(200).json({
            status: true,
            message:
              "Update orders at username " + decoded.username + " successfully",
          });
          request(
            {
              method: "POST",
              uri: url_line_notification,
              header: {
                "Content-Type": "multipart/form-data",
              },
              auth: {
                bearer: process.env.TOKEN,
              },
              form: {
                message: `${decoded.username}  Add bid`,
              },
            },
            (err1, httpResponse, body) => {
              if (err1) {
                console.log(err1);
              } else {
                console.log(body);
              }
            }
          );
        }
      }
    );
  }
});

// PAYMENT YAHOO
app.get("/api/yahoo/payment", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.sqlMessage,
          error: "jwt",
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
      (error, row) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            status: false,
            message: "Error: " + error.sqlMessage,
            error: "sql",
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
app.get("/api/yahoo/payment/slip/:id", (req, res) => {
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
app.patch("/api/yahoo/payment", (req, res) => {
  var decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        res.status(400).json({
          status: false,
          message: error,
          error: "jwt",
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
            error: "sql",
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
                  error: "sql",
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

// HISTORY YAHOO
app.get("/api/yahoo/history", (req, res) => {
  var decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        res.status(400).json({
          status: false,
          message: error,
          error: "jwt",
        });
        console.log("Error: " + error);
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
          error: "sql",
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
// refactor user api++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get("/api/admin/users", (req, res) => {
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
});

app.get("/api/admin/filter/users", (req, res) => {
  const sql = "SELECT * FROM user_customers WHERE username LIKE ?;";
  conn.query(sql, [req.query.username + "%"], (err, row) => {
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

// YAHOO ORDER
app.get("/api/admin/yahoo/order", (req, res) => {
  const sql =
    "SELECT * FROM orders WHERE status = ? AND username LIKE ? AND created_at LIKE ?;";
  conn.query(
    sql,
    ["Auction", req.query.username + "%", req.query.date + "%"],
    (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Select data from order that status 'Auction'",
          data: result,
        });
      }
    }
  );
});
app.post("/api/admin/yahoo/order", (req, res) => {
  let date = genDate();
  let offer = [
    req.body.username,
    req.body.link,
    req.body.imgsrc,
    req.body.price,
    "Auction",
    req.body.remark,
    date,
    date,
  ];
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
      request(
        {
          method: "POST",
          uri: url_line_notification,
          header: {
            "Content-Type": "multipart/form-data",
          },
          auth: {
            bearer: process.env.TOKEN,
          },
          form: {
            message: `${req.body.username}\nOffer Link: ${req.body.link}\nBiding: ${req.body.price} ¥`,
          },
        },
        (err, httpResponse, body) => {
          if (err) {
            console.log(err);
          } else {
            console.log(body);
          }
        }
      );
    }
  });
});
app.patch("/api/admin/yahoo/order/workby", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: err,
          error: 1,
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
          error: 2,
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
app.patch("/api/admin/yahoo/order/win", (req, res) => {
  let decoded = jwt.verify(
    req.headers.token,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        res.status(400).json({
          status: false,
          message: "Error: " + error.sqlMessage,
          error: "jwt",
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
      0,
      date,
      req.body.id,
    ];

    let sql =
      "UPDATE orders SET bid_by=?,status = ?,bid =?, tranfer_fee_injapan =?, delivery_in_thai =?, payment_status=?,inform_bill =?, updated_at = ? WHERE id = ?;";
    conn.query(sql, win, (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
          error: "sql",
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
app.patch("/api/admin/yahoo/order/lose", (req, res) => {
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
app.patch("/api/admin/yahoo/order/inform/bill", (req, res) => {
  const sql = "UPDATE orders SET inform_bill = ? WHERE id = ?;";
  conn.query(sql, [req.body.check, req.body.id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Your login session is expired,\nPlease Sign In Again!",
        error: "jwt",
      });
    } else {
      console.log(result);
      res.status(200).json({
        status: true,
        message: "update check at id " + req.body.id,
      });
    }
  });
});
app.delete("/api/admin/yahoo/order", (req, res) => {
  const sql = "DELETE FROM orders WHERE id = ?;";
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
        message: "delete order successfully!",
      });
    }
  });
});

// YAHOO PAYMENT
app.get("/api/admin/yahoo/payment", (req, res) => {
  const sql =
    "SELECT * FROM orders WHERE (payment_status = ? OR payment_status = ? OR payment_status = ?) AND username LIKE ? AND created_at LIKE ? ORDER BY created_at DESC;";
  conn.query(
    sql,
    [
      "pending1",
      "pending2",
      "pending3",
      req.query.username + "%",
      req.query.date + "%",
    ],
    (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(400).json({
          status: false,
          message: "Error: " + err.sqlMessage,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Select data from order that status 'Auction'",
          data: result,
        });
      }
    }
  );
});
app.patch("/api/admin/yahoo/payment", (req, res) => {
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
        sql =
          "UPDATE orders SET payment_id = ?, payment_status = ? WHERE id = ?;";
        conn.query(
          sql,
          [result.insertId, "paid", req.body.order_id],
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
});

// YAHOO HISTORY
app.get("/api/admin/yahoo/history", (req, res) => {
  let sql = `SELECT * FROM orders WHERE `;
  let order = [];
  if (req.query.status === "win") {
    sql += ` status = 'win' `;
  } else if (req.query.status === "lose") {
    sql += ` status = 'lose' `;
  } else {
    sql += ` (status = 'win' OR status = 'lose') `;
  }
  if (req.query.date !== "") {
    sql += ` AND created_at LIKE ? `;
    order.push(req.query.date + "%");
  }
  if (req.query.username !== "") {
    let username = req.query.username + "%";
    sql += ` AND username LIKE ? `;
    order.push(username);
  }
  if (req.query.trackId !== "") {
    let trackId = req.query.trackId;
    if (trackId[0] === "/") {
      if (trackId.length > 1) {
        sql += ` AND track_id LIKE ? `;
        trackId = "%" + trackId.slice(1);
        order.push(trackId);
      }
    } else {
      trackId += "%";
      sql += ` AND track_id LIKE ? `;
      order.push(trackId);
    }
  }

  if (req.query.roundBoat !== "") {
    let roundBoat = req.query.roundBoat;
    sql += ` AND round_boat = ? `;
    order.push(roundBoat);
  }
  let orderBy = req.query.orderBy;
  if (orderBy === "ASC1") {
    sql += ` ORDER BY created_at ASC;`;
  } else if (orderBy === "DESC1") {
    sql += ` ORDER BY created_at DESC;`;
  } else if (orderBy === "ASC2") {
    sql += ` ORDER BY round_boat ASC;`;
  } else if (orderBy === "DESC2") {
    sql += ` ORDER BY round_boat DESC;`;
  }
  // console.log(order);
  conn.query(sql, order, (err, result) => {
    if (err) {
      // console.log(err.sqlMessage);
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

// app.get("/add/user/customer", (req, res) => {
//   var date = genDate();
//   let data = [];
//   let sql =
//     "INSERT INTO user_customers (username,name,phone,address_case,address,password,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)";
//   data.push(user[0].username);
//   data.push(user[0].name);
//   data.push(user[0].phone);
//   data.push(user[0].case);
//   data.push(user[0].address);
//   data.push(user[0].password);
//   data.push(date);
//   data.push(date);
//   for (let i = 1; i < user.length; i++) {
//     sql += ",(?,?,?,?,?,?,?,?)";
//     data.push(user[i].username);
//     data.push(user[i].name);
//     data.push(user[i].phone);
//     data.push(user[i].case);
//     data.push(user[i].address);
//     data.push(user[i].password);
//     data.push(date);
//     data.push(date);
//   }

//   conn.query(sql, data, (err, result) => {
//     if (err) {
//       console.log(err.sqlMessage);
//       res.status(400).json({
//         status: false,
//         message: "Error: " + err.sqlMessage,
//       });
//     } else {
//       console.log(result);
//       res.status(200).json({
//         status: true,
//         message:
//           "insert into user_customers is successfully at row " +
//           result.insertId,
//       });
//     }
//   });
// });
