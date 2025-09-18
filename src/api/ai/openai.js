const axios = require("axios");

module.exports = (app) => {
  async function openai(model, role, content) {
    try {
      // Gunakan template literal yang benar dengan backticks (``)
      const response = await axios.get(`https://api.platform.web.id/ai?model=${model}&role=${role}&content=${content}`);
      return response.data.result; // Pastikan untuk mengakses data yang benar
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  app.get("/ai/openai", async (req, res) => {
    const { model, role, content } = req.query; // Ambil parameter dari query string
    try {
      const result = await openai(model, role, content); // Kirim parameter ke fungsi openai
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
