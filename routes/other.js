const express = require("express");

const router = express.Router();

const yenController = require("../controllers/yen");

const loginController = require("../controllers/login");

router.get("/api/yen", yenController.getYen);

router.post("/api/yen", yenController.patchYen);

router.post("/api/login", loginController.login);

module.exports = router;
