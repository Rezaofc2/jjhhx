const axios = require("axios");

module.exports = (app) => {
  

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
     const imageResponse = await axios.get(`https://apidl.asepharyana.tech/api/ai/image/gemini?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`,
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
