const axios = require("axios");

module.exports = (app) => {
  
  app.get("/ai/hitamin", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
    const prompt = `ubah kulitnya jadi hitam`
     const imageResponse = await axios.get(`https://apieza.vercel.app/ai/gemini-canvas?text=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}`,
        { responseType: "arraybuffer" },
      )

      // Mengatur header response
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageResponse.data.length,
      })

      // Mengirimkan data gambar
      res.end(imageResponse.data)
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
