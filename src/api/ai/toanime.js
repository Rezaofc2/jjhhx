const axios = require("axios");

module.exports = (app) => {
  async function toanime(imageUrl, style) {
    const { data } = await axios.get(`https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`);
    return data; // Kembalikan data biner gambar
  }

  app.get("/ai/toanime", async (req, res) => {
    try {
      const { imageUrl, style } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const imageBuffer = await toanime(imageUrl, style); // Ambil data gambar langsung

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length,
      });
      res.end(imageBuffer);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
