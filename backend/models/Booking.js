const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    seat: String
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainId: { type: String, required: true },
    trainName: { type: String, required: true },
    source: String,
    destination: String,
    journeyDate: String,
    price: Number,
    passenger: passengerSchema,
    bookingStatus: { type: String, default: "Confirmed" },
    pnr: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
