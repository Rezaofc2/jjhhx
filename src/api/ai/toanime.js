const axios = require("axios");

module.exports = (app) => {
  

  app.get("/ai/toanime", async (req, res) => {
    try {
      const { imageUrl, style } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }

      const imageBuffer = `https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`

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
