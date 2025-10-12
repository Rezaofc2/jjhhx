const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(text, imageUrl) {
    const { data } = await axios.get(`https://api.krizz.my.id/api/ai/edit?text=${encodeURIComponent(text)}&imgUrl=${encodeURIComponent(imageUrl)}`);
    return data; // Kembalikan seluruh data
  }

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

      const result = await geminiCanvas(text, imageUrl);
     

      const imageUrlFromResponse = result;

      // Mengambil gambar dari URL yang diberikan
      const imageResponse = await axios.get(imageUrlFromResponse, { responseType: 'arraybuffer' });
      //const imageBuffer = Buffer.from(imageResponse.data, "binary");

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageResponse.data.length,
      });
      res.end(imageBuffer);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
