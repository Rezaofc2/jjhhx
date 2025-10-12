let fetch = require('node-fetch');
module.exports = (app) => {
  app.get("/stalker/mlstalk", async (req, res) => {
    try {
      const { id, zona} = req.query; // Menggunakan q dari query
      if (!id || !zona) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }

      // Menggunakan q sebagai parameter untuk API
      const response = await fetch(`https://api.lolhuman.xyz/api/mobilelegend/${id}/${zona}?apikey=${global.lolkey}`);
      const hasil = await response.json();

     
      const result = hasil.result; // Menyimpan hasil dari API
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/mlstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
