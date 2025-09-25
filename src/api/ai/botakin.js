const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(imageUrl) {
  const prompt = `ubahkan jadi botak tanpa ada rambut sedikitpun di gambar ini`
    const { data } = await axios.get(`https://api.platform.web.id/editimg?imageUrl=${imageUrl}&prompt=${prompt}`);
    return data; // Kembalikan seluruh data
  }

  app.get("/ai/botak", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const result = await geminiCanvas(imageUrl);
      
      // Pastikan status adalah true dan image ada
      if (!result || !result.status || !result.image || !result.image.url) {
        return res.status(500).json({ status: false, error: "Invalid response structure from geminiCanvas" });
      }

      const imageUrlFromResponse = result.image.url;

      // Mengambil gambar dari URL yang diberikan
      const imageResponse = await axios.get(imageUrlFromResponse, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

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
