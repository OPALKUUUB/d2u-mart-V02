var request = require("request");
const conn = require("../configs/connection");
const jwt = require("jsonwebtoken");
const htmlparser2 = require("htmlparser2");
const render = require("dom-serializer").default;
const CSSselect = require("css-select");
const url_line_notification = "https://notify-api.line.me/api/notify";

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

function jwtVerify(token) {
  let decoded = jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      res.status(400).json({
        status: false,
        message: "Your login session is expired,\nPlease Sign In Again!",
        error: "jwt",
      });
    } else {
      console.log(decoded);
      return decoded;
    }
  });
  return decoded;
}

exports.getAuctionImage = (req, res, next) => {
  // ref: https://stackoverflow.com/questions/31553682/regex-extract-img-src-javascript
  request(req.body.link, function (error, response, body) {
    if (error) {
      res.status(400).json({
        status: false,
        message: "Error: " + error,
      });
    } else {
      if (body === null) {
        res.status(400).json({
          status: false,
          message:
            "Cann't get image from this link! Please show message to admin!",
        });
      } else {
        // const sources = body
        //   .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        //   .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));
        // res.status(200).json({
        //   status: true,
        //   imgsrc: sources[2],
        // });
        const dom = htmlparser2.parseDocument(body);
        // Title
        const title = render(
          CSSselect.selectOne("div.l-contentsHead h1.ProductTitle__text", dom),
          {
            decodeEntities: false,
          }
        )
          .replace(/<h1 class="ProductTitle__text">/, "")
          .replace(/<\/h1>/, "");
        // console.log(title);
        //   IMAGE
        const image = CSSselect.selectAll(
          "div.ProductImage__inner img",
          dom
        ).map((img) => {
          return render(img, { decodeEntities: false }).replace(
            /.*src="([^"]*)".*/,
            "$1"
          );
        });
        // console.log(img);
        //   PRICE
        const temp = render(CSSselect.selectOne("dd.Price__value", dom), {
          decodeEntities: false,
        })
          .replace(/<span class="Price__tax u-fontSize14">/, "")
          .replace(/<\/span>/, "")
          .replace(/<dd class="Price__value">/, "")
          .replace(/<\/dd>/, "")
          .replace(/\n/, "");
        let price = "";
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] === "円") {
            break;
          }
          price += temp[i];
        }
        // console.log(price);
        const details = CSSselect.selectAll(
          "li.ProductDetail__item dd.ProductDetail__description",
          dom
        ).map((detail) => {
          return render(detail, { decodeEntities: false })
            .replace(
              /<dd class="ProductDetail__description"><span class="ProductDetail__bullet">：<\/span>/,
              ""
            )
            .replace(/<\/dd>/, "");
        });
        let detail_obj = {
          volumn: details[0],
          startDate: details[1],
          endDate: details[2],
        };
        //   console.log(detail_obj);
        res.status(200).json({
          status: "true",
          message: "Get data from this successfully 👍",
          imgsrc: image[0],
          data: {
            image: image,
            price: price,
            detail: detail_obj,
            title: title,
          },
        });
      }
    }
  });
};
exports.getOrder = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};
exports.postOrder = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};
exports.patchOrderAddbid = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
                message: `\nUsername: ${decoded.username}\nAddbid#${req.body.mode}: ${req.body.addbid} ¥`,
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
};
exports.getOrderPayment = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};
exports.getOrderPaymentSlip = (req, res) => {
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
};
exports.patchOrderPostPayment = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};
exports.getOrderHistory = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};

exports.patchAdminOrderNoted = (req, res) => {
  const sql = `UPDATE orders SET noted = ? WHERE id = ?;`;
  conn.query(sql, [req.body.noted, req.body.id], (err, result) => {
    if (err) {
      res.status(400).json({
        status: false,
        message: "Error: " + err.sqlMessage,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "update noted at orders successfully!'",
      });
    }
  });
};
exports.filterAdminOrder = (req, res) => {
  const sql =
    "SELECT * FROM orders WHERE status = ? AND username LIKE ? AND created_at LIKE ? ORDER BY created_at DESC;";
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
};

exports.postAdminOrder = (req, res) => {
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
};

exports.patchAdminOrderWorkby = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};

exports.patchAdminOrderWin = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};

exports.patchAdminOrderLose = (req, res) => {
  const decoded = jwtVerify(req.headers.token);
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
};

exports.patchAdminOrderInformBill = (req, res) => {
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
};

exports.deleteAdminOrder = (req, res) => {
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
};

exports.filterAdminOrderPayment = (req, res) => {
  const sql = `SELECT * FROM orders 
    WHERE (payment_status = ? OR payment_status = ? OR payment_status = ?)
    AND username LIKE ? AND created_at LIKE ? ORDER BY created_at DESC;`;
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
};

exports.patchAdminOrderPayment = (req, res) => {
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
};

exports.filterAdminOrderHistory = (req, res) => {
  let sql = `SELECT * FROM orders WHERE payment_status = 'paid' AND `;
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
      console.log(err);
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
};
