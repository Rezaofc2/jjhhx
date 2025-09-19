const axios = require("axios");

module.exports = (app) => {
  async function metaai(text) {
    try {
      // Menggunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.siputzx.my.id/api/ai/metaai?query=${text}`);
      return response.data.data; // Pastikan untuk mengakses data yang benar
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/ai/metaai", async (req, res) => {
    const { text } = req.query; // Ambil parameter dari query string
    if (!text) {
      return res.status(400).json({ status: false, error: "Parameter 'text' is required." });
    }
    
    try {
      const result = await metaai(text); // Kirim parameter ke fungsi gemini
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
