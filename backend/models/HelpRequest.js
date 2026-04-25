const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String, required: true },
    trainNumber: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
