const axios = require("axios");

module.exports = (app) => {
  async function tr(text, lang) {
    try {
      // Menggunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.platform.web.id/translate?text=${encodeURIComponent(text)}&fromLang=auto&toLang=${lang}`);
      
      // Memastikan untuk mengakses data yang benar
      if (response.data.success) {
        return response.data.result.translated; 
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
