const axios = require("axios");

module.exports = (app) => {
  app.get("/ai/toanime", async (req, res) => {
    try {
      const { imageUrl, style } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      // Mengambil gambar dari URL yang diberikan
      const response = await axios.get(`https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`, {
        responseType: 'arraybuffer' // Mengatur responseType untuk mendapatkan buffer
      });

      // Mengatur header respons
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": response.data.length,
      });

      // Mengirimkan gambar sebagai respons
      res.end(response.data);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
