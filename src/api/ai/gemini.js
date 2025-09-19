const axios = require("axios");

module.exports = (app) => {
  async function gemini(text) {
    try {
      // Menggunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.zenzxz.my.id/ai/gemini?text=${encodeURIComponent(text)}`);
      return response.data.assistant; // Pastikan untuk mengakses data yang benar
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/ai/gemini", async (req, res) => {
    const { text } = req.query; // Ambil parameter dari query string
    if (!text) {
      return res.status(400).json({ status: false, error: "Parameter 'text' is required." });
    }
    
    try {
      const result = await gemini(text); // Kirim parameter ke fungsi gemini
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
