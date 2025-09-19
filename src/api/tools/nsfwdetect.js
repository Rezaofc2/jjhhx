const axios = require("axios");

module.exports = (app) => {
  async function metaai(url) {
    try {
      // Menggunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.ryzumi.vip/api/tool/nsfw-checker?url=${url}`);
      return response.data.data; // Pastikan untuk mengakses data yang benar
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/tools/nsfw-detect", async (req, res) => {
    const { url } = req.query; // Ambil parameter dari query string
    if (!url) {
      return res.status(400).json({ status: false, error: "Parameter 'url' is required." });
    }
    
    try {
      const result = await metaai(url); // Kirim parameter 'url' ke fungsi metaai
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
