const axios = require("axios");

module.exports = (app) => {
  async function gempa() {
    try {
      const response = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
      return response.data;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/info/gempa", async (req, res) => {
    try {
      const result = await gempa();
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
