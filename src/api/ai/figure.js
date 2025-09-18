const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(imageUrl) {
    const { data } = await axios.get(`https://rynekoo-api.hf.space/ai/convert/tofigure?imageUrl=${imageUrl}`);
    return data; // Kembalikan seluruh data
  }

  app.get("/ai/figure", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const result = await geminiCanvas(imageUrl);
      
      // Pastikan status adalah true dan result ada
      if (!result || !result.status || !result.result) {
        return res.status(500).json({ status: false, error: "Invalid response structure from geminiCanvas" });
      }

      const imageUrlFromResponse = result.result;

      // Mengambil gambar dari URL yang diberikan
      const imageResponse = await axios.get(imageUrlFromResponse, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      res.writeHead(200, {
        "Content-Type": "image/jpeg", // Sesuaikan dengan jenis konten yang sesuai
        "Content-Length": imageBuffer.length,
      });
      res.end(imageBuffer);
    } catch (error) {
      console.error(error); // Tambahkan log error untuk debugging
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
