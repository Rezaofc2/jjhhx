let fetch = require('node-fetch');
module.exports = (app) => {
  app.get("/stalker/codmstalk", async (req, res) => {
    try {
      const { q } = req.query; // Menggunakan q dari query
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }

      // Menggunakan q sebagai parameter untuk API
      const response = await fetch(`https://api.lolhuman.xyz/api/codm/${q}?apikey=${process.env.lolhuman}`);
      const hasil = await response.json();

      if (hasil.status !== 200) {
        return res.status(500).json({ status: false, error: "API returned an error" });
      }

      const result = hasil.result; // Menyimpan hasil dari API
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/codnstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
