const axios = require("axios");

module.exports = (app) => {
  async function xvideo(url) {
    try {
      const response = await axios.get(`https://api.agatz.xyz/api/xvideodown?url=${encodeURIComponent(url)}`);
      return response.data.data.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Unable to fetch weather data");
    }
  }

  app.get("/downloader/xvideo", async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }

    try {
      const result = await xvideo(url);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
