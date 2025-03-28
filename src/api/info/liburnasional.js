const axios = require("axios");

module.exports = (app) => {
  async function liburnasional() {
    try {
      const response = await axios.get("https://api.siputzx.my.id/api/info/liburnasional");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/info/liburnasional", async (req, res) => {
    try {
      const result = await liburnasional();
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
