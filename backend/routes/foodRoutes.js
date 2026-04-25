const express = require("express");
const { getFoodItems, placeFoodOrder } = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoodItems);
router.post("/order", placeFoodOrder);

module.exports = router;
