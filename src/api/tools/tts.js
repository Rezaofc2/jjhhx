const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/tts", async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });

      const token = Math.random() > 0.5 ? process.env.rose : process.env.rose1;

      const options = {
        method: "POST",
        url: "https://api.itsrose.rest/tts/inference_text",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          server_id: "lov",
          voice_id: "EXAVITQu4vr4xnSDxMaL",
          text: text,
          model_id: "eleven_multilingual_v2",
          output_format: "mp3_22050_32",
          apply_text_normalization: "auto",
        },
      };

      const { data } = await axios.request(options);
      if (!data.result || !data.result.audios || !data.result.audios[0]) {
        return res.status(500).json({ status: false, error: "Failed to generate audio" });
      }

      // Ambil file audio dari URL
      const audioUrl = data.result.audios[0];
      const anu = await axios.get(audioUrl, { responseType: "arraybuffer" });

      // Mengirimkan audio langsung
      res.writeHead(200, {
        "Content-Type": "audio/mpeg", // Format sesuai file (MP3)
        "Content-Length": Buffer.byteLength(anu.data),
      });

      res.end(Buffer.from(anu.data)); // Kirim audio sebagai Buffer
    } catch (error) {
      console.error("Error in TTS:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
};