const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/brat", async (req, res) => {
    const { text, mode } = req.query; // Ambil parameter dari query

    // Ubah mode menjadi 'false' atau 'true' sesuai permintaan
    const isAnimated = mode === 'animated' ? 'true' : 'false'; // Ganti mode menjadi string 'true' atau 'false'

    try {
      // Memanggil API untuk mendapatkan gambar atau video NSFW Loli
      const imageResponse = await axios.get(
        `https://api.siputzx.my.id/api/m/brat?text=${text}&isAnimated=${isAnimated}&delay=500`,
        { responseType: "arraybuffer" }
      );

      // Mengatur header response berdasarkan tipe konten
      if (isAnimated === 'true') {
        res.writeHead(200, {
          "Content-Type": "image/gif", // Tipe konten untuk animasi
          "Content-Length": imageResponse.data.length,
        });
      } else {
        res.writeHead(200, {
          "Content-Type": "image/png", // Tipe konten untuk gambar
          "Content-Length": imageResponse.data.length,
        });
      }

      // Mengirimkan data gambar atau video
      res.end(imageResponse.data);
    } catch (error) {
      console.error(error); // Log error untuk debugging
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
