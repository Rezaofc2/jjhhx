const axios = require("axios");

module.exports = (app) => {
  app.get("/ai/toanime", async (req, res) => {
    try {
      const { imageUrl, style } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      // Mengambil gambar dari API eksternal
      const response = await axios.get(`https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`
      );

      const imageBuffer = response.data; // Ambil data biner dari respons

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length,
      });
      res.end(imageBuffer); // Kirimkan data gambar ke klien
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
