const axios = require("axios");

module.exports = (app) => {
  
  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      // Memastikan imageUrl dan text diberikan
      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
      if (!text) {
        return res.status(400).json({ status: false, error: "text is required" });
      }

      // Mengubah URL sesuai dengan permintaan
      const apiUrl = `https://rynekoo-api.hf.space/ai/qwen/image-edit?prompt=${encodeURIComponent(text)}&imageUrl=${encodeURIComponent(imageUrl)}`;

      const imageResponse = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Memeriksa apakah permintaan berhasil
      
        const imageUrlResult = imageResponse.data.result;

        // Mengambil gambar dari URL hasil
        const finalImageResponse = await axios.get(imageUrlResult, { responseType: "arraybuffer" });

        // Mengatur header response untuk gambar
        res.writeHead(200, {
          "Content-Type": "image/webp", // Atur sesuai dengan format gambar yang dihasilkan
          "Content-Length": finalImageResponse.data.length,
        });

        // Mengirimkan data gambar
        res.end(finalImageResponse.data);
      
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
