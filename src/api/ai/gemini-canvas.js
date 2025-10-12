const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(text, imageUrl) {
    const { data } = await axios.get(`https://api.deline.my.id/ai/editimg?url=${imageUrl}&prompt=${text}`);
    return data; // Kembalikan seluruh data
  }

  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const result = await geminiCanvas(text, imageUrl);
      
      // Pastikan status adalah true dan result ada
      if (!result || !result.status || !result.result || !result.result.url) {
        return res.status(500).json({ status: false, error: "Invalid response structure from geminiCanvas" });
      }

      const imageUrlFromResponse = result.result.url;

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
