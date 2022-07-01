const query = require("../other/query");
const genToken = require("../other/genToken");

exports.login = async (req, res) => {
  const body = req.body;
  const login = [body.username];
  const sql = `
    SELECT password, id
    FROM user_customers
    WHERE username = ?;
    `;

  let rows;
  try {
    rows = await query(sql, login).then((res) => res);
    if (rows.length) {
      let token = genToken(body.username, rows[0].id);
      res.status(200).json({
        status: true,
        message: "GET /api/yahoo/historys success👍",
        token: token,
      });
    } else {
      res.status(403).json({
        status: false,
        error: "no data",
        message: "GET /auth/login fail👎",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      error: error,
      message: "GET /api/yahoo/historys fail👎",
    });
  }
};
