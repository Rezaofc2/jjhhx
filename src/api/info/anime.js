const axios = require("axios");

module.exports = (app) => {
  async function animeinfo(content) {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${content}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching content", error);
      throw error;
    }
  }

  app.get("/info/anime", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
      }
      const data = await animeinfo(q);
      res.status(200).json({
        status: true,
        result: data,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
