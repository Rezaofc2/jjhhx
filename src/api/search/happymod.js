const axios = require("axios");

module.exports = (app) => {
  async function hppymod(q) { // Tambahkan parameter q
    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/happymod?search=${q}`);
      return data.data; // Kembalikan data yang didapat
    } catch (error) {
      throw error;
    }
  }

  app.get("/search/happymod", async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }
    try {
      const hsl = await hppymod(q); // Kirim q ke fungsi hppymod
      res.status(200).json({
        status: true,
        data: hsl,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
