const express = require("express");
const { createBooking, getBookings, confirmPayment } = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.post("/confirm-payment", confirmPayment);

module.exports = router;
