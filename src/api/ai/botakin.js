const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(imageUrl) {
    const prompt = `ubah style gambar ini menjadi orang botak`;
    const { data } = await axios.get(`https://api.deline.my.id/ai/editimg?url=${imageUrl}&prompt=${prompt}`);
    return data; // Kembalikan seluruh data
  }

  app.get("/ai/botak", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const result = await geminiCanvas(imageUrl);
      
      // Pastikan status adalah true dan result ada
      if (!result || !result.status || !result.result || !result.result.url) {
        return res.status(500).json({ status: false, error: "Invalid response structure from geminiCanvas" });
      }

      const imageUrlFromResponse = result.result.result.url;

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
