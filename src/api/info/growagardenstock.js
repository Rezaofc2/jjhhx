const axios = require("axios");

module.exports = (app) => {
  async function grow() {
    try {
      const response = await axios.get("https://api.zenzxz.my.id/info/growagardenstock");
      // Memastikan kita mengakses data dengan benar
      return response.data.result; // Mengembalikan hasil dari response.data.result
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/info/growagardenstock", async (req, res) => {
    try {
      const result = await grow();
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
