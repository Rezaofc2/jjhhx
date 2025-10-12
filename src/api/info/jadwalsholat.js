const axios = require("axios");

module.exports = (app) => {
  async function sholat(q) {
    try {
      const response = await axios.get(`https://api.ryzumi.vip/api/search/jadwal-sholat?kota=${encodeURIComponent(q)}`);
      return response.data; // Mengembalikan seluruh data, bukan hanya data.jadwal
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
      
      // Memeriksa apakah ada jadwal yang ditemukan
      if (result.total === 0) {
        return res.status(404).json({ status: false, error: "No schedules found" });
      }

      res.status(200).json({
        status: true,
        schedules: result.schedules, // Mengembalikan jadwal yang ditemukan
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
