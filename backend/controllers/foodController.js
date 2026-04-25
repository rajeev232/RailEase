const { foodItems } = require("../data/mockData");

const getFoodItems = async (req, res) => {
  return res.status(200).json({ items: foodItems });
};

const placeFoodOrder = async (req, res) => {
  const { items, customerName, trainNumber } = req.body;

  if (!items || !items.length || !customerName || !trainNumber) {
    return res.status(400).json({ message: "Order details are incomplete." });
  }

  return res.status(201).json({
    message: "Food order placed successfully.",
    orderId: `FOOD-${Date.now()}`,
    status: "Preparing",
    eta: "20-25 min"
  });
};

module.exports = { getFoodItems, placeFoodOrder };
