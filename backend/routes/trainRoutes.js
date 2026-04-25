const express = require("express");
const { getTrains } = require("../controllers/trainController");

const router = express.Router();

router.get("/", getTrains);

module.exports = router;
