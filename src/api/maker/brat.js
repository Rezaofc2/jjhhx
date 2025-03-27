const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/brat", async (req, res) => {
    const { text, mode } = req.query; // Ambil parameter dari query

    try {
      // Memanggil API untuk mendapatkan gambar atau video NSFW Loli
      const imageResponse = await axios.get(
        `https://fastrestapis.fasturl.cloud/maker/brat/animated?text=${text}&mode=${mode}`,
        { responseType: "arraybuffer" }
      );

      // Mengatur header response berdasarkan tipe konten
      if (mode === 'animated') {
        res.writeHead(200, {
          "Content-Type": "image/gif", // Ubah tipe konten ke video
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
