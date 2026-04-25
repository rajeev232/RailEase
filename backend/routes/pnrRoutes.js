const express = require("express");
const { getPnrStatus } = require("../controllers/pnrController");

const router = express.Router();

router.get("/:pnr", getPnrStatus);

module.exports = router;
