const Booking = require("../models/Booking");
const { trains } = require("../data/mockData");

const generatePnr = () => String(Date.now()).slice(-10);

const createBooking = async (req, res) => {
  try {
    const { trainId, journeyDate, passenger, userId } = req.body;

    if (!trainId || !journeyDate || !passenger?.name || !passenger?.seat || !userId) {
      return res.status(400).json({ message: "Incomplete booking details." });
    }

    const train = trains.find((item) => item.id === trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found." });
    }

    const booking = await Booking.create({
      userId,
      trainId: train.id,
      trainName: train.name,
      source: train.source,
      destination: train.destination,
      journeyDate,
      price: train.price,
      passenger,
      pnr: generatePnr()
    });

    return res.status(201).json({ message: "Booking confirmed.", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create booking.", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
  }
};

module.exports = { createBooking, getBookings };
