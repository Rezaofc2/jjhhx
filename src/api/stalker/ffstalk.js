const fetch = require('node-fetch'); // Mengimpor modul node-fetch

module.exports = (app) => {
  app.get("/stalker/ffstalk", async (req, res) => {
    try {
      const { id } = req.query; // Mengambil id dari query parameter
      if (!id) {
        return res.status(400).json({ status: false, error: "Query 'id' is required" });
      }

      // Menggunakan id sebagai parameter untuk API
      const response = await fetch(`https://api.deline.my.id/stalker/stalkff?id=${id}`);
      
      // Memeriksa apakah respons dari API berhasil
      if (!response.ok) {
        return res.status(response.status).json({ status: false, error: "Failed to fetch data from API" });
      }

      const hasil = await response.json(); // Mengonversi respons ke format JSON

      // Memeriksa apakah hasil dari API memiliki properti result
      if (!hasil.result) {
        return res.status(404).json({ status: false, error: "Data not found" });
      }

      const result = hasil.result; // Menyimpan hasil dari API
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/ffstalk:", error); // Menambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
