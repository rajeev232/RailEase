const express = require("express");
const {
  getComplaintCategories,
  createComplaint,
  getComplaints
} = require("../controllers/helpController");

const router = express.Router();

router.get("/categories", getComplaintCategories);
router.get("/", getComplaints);
router.post("/", createComplaint);

module.exports = router;
