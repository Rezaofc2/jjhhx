const axios = require("axios");

module.exports = (app) => {
  async function geminiCanvas(imageUrl) {
    const prompt = `Transform this image into an adorable chibi anime style! Cute big head with large expressive eyes, small body proportions, kawaii aesthetic. Soft pastel colors, smooth cel-shading, anime illustration style. Exaggerated cute features, chubby cheeks, simplified details. Digital art, high quality, vibrant colors, clean lines, professional anime artwork`;
    
    const { data } = await axios.get(`https://rynekoo-api.hf.space/ai/gemini/nano-banana?prompt=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}`);
    return data; // Kembalikan seluruh data
  }

  app.get("/ai/tochibi", async (req, res) => {
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

      const imageUrlFromResponse = result.result; // Ambil URL gambar dari respons

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
