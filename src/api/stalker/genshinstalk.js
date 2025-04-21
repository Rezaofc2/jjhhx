let fetch = require('node-fetch');

module.exports = (app) => {
  app.get("/stalker/genshinstalk", async (req, res) => {
    try {
      const { q } = req.query; // Menggunakan q dari query
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }

      // Menggunakan nama variabel yang berbeda untuk respons fetch
      let fetchResponse = await fetch(`https://enka.network/api/uid/${q}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      });

      // Memeriksa apakah respons dari fetch berhasil
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        return res.status(fetchResponse.status).json({ status: false, error: errorData.message || "Failed to fetch data" });
      }

      let data = await fetchResponse.json();
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
