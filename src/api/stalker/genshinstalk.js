let fetch = require('node-fetch');
module.exports = (app) => {
  app.get("/stalker/genshinstalk", async (req, res) => {
    try {
      const { q } = req.query; // Menggunakan q dari query
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }

     let res = await fetch(`https://enka.network/api/uid/${q}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      });
      let data = await res.json();

      const result = data.playerInfo;
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/genshinstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
