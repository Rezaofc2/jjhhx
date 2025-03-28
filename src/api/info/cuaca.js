const axios = require("axios");

module.exports = (app) => {
  async function fetchWeather(q) {
    try {
      const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(q)}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Unable to fetch weather data");
    }
  }

  app.get("/info/cuaca", async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }

    try {
      const result = await fetchWeather(q);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
