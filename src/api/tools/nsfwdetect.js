const axios = require("axios");

module.exports = (app) => {
  async function nsfw(url) {
    try {
      const response = await axios.get(`https://api.ryzumi.vip/api/tool/nsfw-checker?url=${encodeURIComponent(url)}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching NSFW data:", error);
      throw new Error("Unable to fetch NSFW data");
    }
  }

  app.get("/tools/nsfw-detect", async (req, res) => {
    const { url } = req.query;

    // Validasi URL
    if (!url) {
      return res.status(400).json({ status: false, error: "URL parameter is required." });
    }

    try {
      const result = await nsfw(url);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
