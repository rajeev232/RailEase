const axios = require("axios");

const getPnrStatus = async (req, res) => {
  const { pnr } = req.params;

  if (!pnr || pnr.length !== 10 || isNaN(pnr)) {
    return res.status(400).json({ message: "Invalid PNR. Please enter a 10-digit PNR number." });
  }

  const options = {
    method: 'GET',
    url: `https://real-time-pnr-status-api-for-indian-railways.p.rapidapi.com/name/${pnr}`,
    headers: {
      'x-rapidapi-key': '2c751f6ec7mshee46a5cb50f1fe5p10db0djsn1025b3a6a14c',
      'x-rapidapi-host': 'real-time-pnr-status-api-for-indian-railways.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log(`[PNR REQUEST] New Provider - PNR: ${pnr}`);
    const response = await axios.request(options);
    const data = response.data;

    console.log("[PNR RESPONSE RAW]:", JSON.stringify(data));

    // Based on the provided example, the API returns data directly. 
    // We check for pnrNo or absence of errorMsg to confirm success.
    if (data && data.pnrNo && !data.errorMsg) {
      const simplifiedResponse = {
        pnrNo: data.pnrNo,
        trainName: data.trainName || "N/A",
        trainNumber: data.trainNum || "N/A",
        fromStation: data.stationFrom || "N/A",
        toStation: data.stationTo || "N/A",
        departureDate: data.departureDate || "N/A",
        arrivalDate: data.arrivalDate || "N/A",
        journeyClass: data.journeyClass || "N/A",
        chartStatus: data.chartStts || "N/A",
        passengers: Array.isArray(data.passengerDetailsDTO) ? data.passengerDetailsDTO.map(p => ({
          name: p.displayName || `Passenger ${p.serialNo}`,
          seat: `${p.coachNo || ''} ${p.seatNo || ''}`.trim() || "Pending",
          status: p.seatStts || "N/A"
        })) : []
      };
      return res.status(200).json(simplifiedResponse);
    } else {
      return res.status(404).json({ 
        message: data.errorMsg || "PNR details not found. Please check the number.",
        raw: data
      });
    }

  } catch (error) {
    const errorData = error.response ? error.response.data : error.message;
    console.error("[PNR API ERROR]:", errorData);
    
    return res.status(500).json({ 
      message: "Live PNR data temporarily unavailable.",
      details: errorData
    });
  }
};

module.exports = { getPnrStatus };
