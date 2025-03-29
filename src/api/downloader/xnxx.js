const axios = require("axios");

module.exports = (app) => {
  async function xnxx(url) {
    try {
      const response = await axios.get(`https://api.agatz.xyz/api/xnxxdown?url=${encodeURIComponent(url)}`);
      return response.data.data; // Akses data dengan benar
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Unable to fetch data");
    }
  }

  app.get("/downloader/xnxx", async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }

    try {
      const result = await xnxx(url);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
