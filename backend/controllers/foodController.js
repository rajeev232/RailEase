const { foodItems } = require("../data/mockData");

const getFoodItems = async (req, res) => {
  return res.status(200).json({ items: foodItems });
};

const placeFoodOrder = async (req, res) => {
  const { items, customerName, trainNumber, utr } = req.body;

  if (!items || !items.length || !customerName || !trainNumber || !utr) {
    return res.status(400).json({ message: "Order details are incomplete. UTR is required." });
  }

  return res.status(201).json({
    message: "We will check and after that proceed the order",
    orderId: `FOOD-${Date.now()}`,
    status: "Payment Pending Verification",
    eta: "TBD"
  });
};

module.exports = { getFoodItems, placeFoodOrder };
