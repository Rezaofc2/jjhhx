const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/tts", async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });

      // Mengambil data dari API
      const response = await axios.get(`https://api.platform.web.id/tts?text=${encodeURIComponent(text)}`);

      // Mengirimkan hasil dalam format JSON
      res.status(200).json({
        status: true,
        result: response.data // Mengirimkan data langsung dari API
      });
    } catch (error) {
      console.error("Error in TTS:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
