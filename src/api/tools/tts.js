const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/tts", async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });

      // Perbaikan pada penggunaan template literal
      const response = await axios.get(`https://api.platform.web.id/tts?text=${encodeURIComponent(text)}`, { responseType: "arraybuffer" });

      // Mengirimkan audio langsung
      res.writeHead(200, {
        "Content-Type": "audio/mpeg", // Format sesuai file (MP3)
        "Content-Length": Buffer.byteLength(response.data),
      });

      res.end(Buffer.from(response.data)); // Kirim audio sebagai Buffer
    } catch (error) {
      console.error("Error in TTS:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
