const query = require("./query");
const query_old = require("../other/query");

exports.addBooking = async (req, res) => {
  // console.log(req);
  // res.json({ status: true });
  const sql_booking =
    "insert into booking (username, price, address, slip_img, count_all, created_at, updated_at) values (?,?,?,?,?,?,?)";
  const sql_user = "select * from user_customers where username like ?;";

  let date = new Date().toLocaleString();
  try {
    const users = await query_old(sql_user, [res.locals.username]).then(
      (res) => res
    );
    let user = users[0];
    const booking = await query(sql_booking, [
      user.username,
      req.body.price,
      user.address,
      req.body.slip_image,
      req.body.count,
      date,
      date,
    ]).then((res) => res);
    let data = [];
    // console.log(req.body.items.length);
    for (let i = 0; i < req.body.items.length; i++) {
      let temp = [
        booking.insertId,
        req.body.items[i].id,
        parseInt(req.body.items[i].count),
        req.body.items[i].channel,
        req.body.items[i].price,
      ];
      data.push(temp);
    }
    const sql_order =
      "insert into orders (booking_id, order_id, count, channel, price) values ?;";
    const order = await query(sql_order, [data]).then((res) => res);
    res.status(200).json({ status: true, message: order });
  } catch (err) {
    res.status(400).json({ status: false, error: err });
  }
};
