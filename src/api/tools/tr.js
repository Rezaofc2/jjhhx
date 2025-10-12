const axios = require("axios");

module.exports = (app) => {
  async function tr(text, lang) {
    try {
      // Menggunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(text)}&source=auto&target=${lang}`);
      
      // Memastikan untuk mengakses data yang benar
      if (response.data.status && response.data.data) {
        return response.data.data.translatedText; 
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/tools/translate", async (req, res) => {
    const { text, lang } = req.query; // Ambil parameter dari query string
    if (!text || !lang) {
      return res.status(400).json({ status: false, error: "Text and lang parameters are required." });
    }

    try {
      const result = await tr(text, lang); // Kirim parameter ke fungsi tr
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
