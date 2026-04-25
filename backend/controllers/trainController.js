const { trains } = require("../data/mockData");

const getTrains = async (req, res) => {
  const { source, destination, date } = req.query;
  let results = trains;

  if (source) {
    results = results.filter((train) => train.source.toLowerCase() === source.toLowerCase());
  }

  if (destination) {
    results = results.filter(
      (train) => train.destination.toLowerCase() === destination.toLowerCase()
    );
  }

  return res.status(200).json({
    message: date ? `Train results for ${date}` : "Train results",
    trains: results
  });
};

module.exports = { getTrains };
