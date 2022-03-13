const express = require("express");

const router = express.Router();

const annoucementController = require("../controllers/annoucement");

const userProfileController = require("../controllers/userProfile");

const yahooController = require("../controllers/yahoo");

router.get("/api/admin/annoucement", annoucementController.getAnnoucement);

router.patch("/api/admin/annoucement", annoucementController.patchAnnoucement);

router.get("/api/admin/users", userProfileController.getUsername);

router.get("/api/admin/filter/users", userProfileController.filterUsername);

router.patch("/api/admin/user", userProfileController.updateUser);

router.get("/api/admin/yahoo/order", yahooController.filterAdminOrder);

router.post("/api/admin/yahoo/order", yahooController.postAdminOrder);

router.patch(
  "/api/admin/yahoo/order/workby",
  yahooController.patchAdminOrderWorkby
);

router.patch(
  "/api/admin/yahoo/order/noted",
  yahooController.patchAdminOrderNoted
);
router.patch("/api/admin/yahoo/order/win", yahooController.patchAdminOrderWin);

router.patch(
  "/api/admin/yahoo/order/lose",
  yahooController.patchAdminOrderLose
);

router.patch(
  "/api/admin/yahoo/order/inform/bill",
  yahooController.patchAdminOrderInformBill
);

router.delete("/api/admin/yahoo/order", yahooController.deleteAdminOrder);

router.get("/api/admin/yahoo/payment", yahooController.filterAdminOrderPayment);

router.patch(
  "/api/admin/yahoo/payment",
  yahooController.patchAdminOrderPayment
);

router.get("/api/admin/yahoo/history", yahooController.filterAdminOrderHistory);

module.exports = router;
