const axios = require("axios");

module.exports = (app) => {
  async function sholat(q) {
    try {
      const response = await axios.get(`https://api.agatz.xyz/api/jadwalsholat?kota=${encodeURIComponent(q)}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Unable to fetch data");
    }
  }

  app.get("/info/jadwalsholat", async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }

    try {
      const result = await sholat(q);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
