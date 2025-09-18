let fetch = require('node-fetch');

module.exports = (app) => {
  app.get("/nsfw/onani", async (req, res) => {
    try {
      const videoUrl = "https://jerrycoder.oggyapi.workers.dev/msb"; // URL video
      const response = await fetch(videoUrl);

      // Cek apakah respons berhasil
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Set header untuk respons
      res.writeHead(200, {
        "Content-Type": "video/mp4", // Ganti dengan tipe konten video yang sesuai
        "Content-Length": response.headers.get('content-length'), // Mendapatkan panjang konten dari respons
      });

      // Mengalirkan konten video ke respons
      response.body.pipe(res);
    } catch (error) {
      console.error("Error in /nsfw/onani:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
