let fetch = require('node-fetch');
module.exports = (app) => {
  app.get("/stalker/githubstalk", async (req, res) => {
    try {
      const {q} = req.query; // Menggunakan q dari query
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }

      // Menggunakan q sebagai parameter untuk API
      const response = await fetch(`https://api.lolhuman.xyz/api/github/${q}?apikey=${global.lolkey}`);
      const hasil = await response.json();
      const result = hasil.result; // Menyimpan hasil dari API
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/githubstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
