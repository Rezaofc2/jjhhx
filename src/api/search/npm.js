const axios = require("axios");

module.exports = (app) => {
  async function npm(text) {
    try {
      const response = await axios.get(`http://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(text)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/search/npm", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await npm(q);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /search/npm:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
