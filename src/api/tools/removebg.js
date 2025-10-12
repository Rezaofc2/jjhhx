const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/removebg", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({
          status: false,
          error: "imageUrl is required",
        });
      }

      const { data } = await axios.get("https://api.deline.my.id/tools/removebg?url=" + imageUrl);

      // Mengambil hanya height, width, dan cutoutUrl dari data.result
      const result = {
        height: data.result.height,
        width: data.result.width,
        cutoutUrl: data.result.cutoutUrl,
      };

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  });
};
