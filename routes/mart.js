const express = require("express");

const router = express.Router();

const martController = require("../controllers/mart/booking");

router.post("/api/mart/booking", martController.addBooking);

module.exports = router;
