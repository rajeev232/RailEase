const { pnrStatuses } = require("../data/mockData");

const getPnrStatus = async (req, res) => {
  const { pnr } = req.params;

  if (!pnr || pnr.length < 6) {
    return res.status(400).json({ message: "Enter a valid PNR number." });
  }

  const lastDigit = Number(String(pnr).slice(-1));
  const status = pnrStatuses[lastDigit % pnrStatuses.length];

  return res.status(200).json({
    pnr,
    status,
    coach: `B${(lastDigit % 4) + 1}`,
    seat: `${(lastDigit % 55) + 1}`,
    trainName: "Superfast Express",
    updatedAt: new Date().toISOString()
  });
};

module.exports = { getPnrStatus };
