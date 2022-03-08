const express = require("express");

const router = express.Router();

const yahooController = require("../controllers/yahoo");

const userProfileController = require("../controllers/userProfile");

// PROFILE
router.get("/api/user/customer", userProfileController.getUserProfile);
router.patch("/api/user/customer", userProfileController.patchUserProfile);
router.post("/api/user/customer", userProfileController.userRegister);

// YAHOO
router.post("/api/yahoo/image", yahooController.getAuctionImage);
router.get("/api/yahoo/order", yahooController.getOrder);
router.post("/api/yahoo/order", yahooController.postOrder);
router.patch("/api/yahoo/order/addbid", yahooController.patchOrderAddbid);
router.get("/api/yahoo/payment", yahooController.getOrderPayment);
router.get("/api/yahoo/payment/slip/:id", yahooController.getOrderPaymentSlip);
router.patch("/api/yahoo/payment", yahooController.patchOrderPostPayment);
router.get("/api/yahoo/history", yahooController.getOrderHistory);

module.exports = router;
