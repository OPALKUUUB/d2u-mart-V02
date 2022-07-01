const express = require("express");
const router = express.Router();

const loginController = require("../controllers/auth/login");

router.post("/auth/login", loginController.login);

module.exports = router;
