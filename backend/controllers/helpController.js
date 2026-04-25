const HelpRequest = require("../models/HelpRequest");
const { complaints } = require("../data/mockData");

const getComplaintCategories = async (req, res) => {
  return res.status(200).json({ categories: complaints });
};

const createComplaint = async (req, res) => {
  try {
    const { userId, category, trainNumber, message } = req.body;

    if (!category || !trainNumber || !message) {
      return res.status(400).json({ message: "All complaint fields are required." });
    }

    const complaint = await HelpRequest.create({
      userId,
      category,
      trainNumber,
      message,
      status: "Open"
    });

    return res.status(201).json({ message: "Complaint submitted successfully.", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit complaint.", error: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const complaintsList = await HelpRequest.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ complaints: complaintsList });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints.", error: error.message });
  }
};

module.exports = { getComplaintCategories, createComplaint, getComplaints };
