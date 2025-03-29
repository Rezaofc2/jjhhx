const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/animebrat", async (req, res) => {
    const { text } = req.query; // Ambil parameter dari query

    try {
      // Memanggil API untuk mendapatkan gambar atau video NSFW Loli
      const imageResponse = await axios.get(
        `https://api.agungny.my.id/api/animbrat?q=${text}`,
        { responseType: "arraybuffer" }
      );

        res.writeHead(200, {
          "Content-Type": "image/png", // Tipe konten untuk gambar
          "Content-Length": imageResponse.data.length,
        });

      // Mengirimkan data gambar atau video
      res.end(imageResponse.data);
    } catch (error) {
      console.error(error); // Log error untuk debugging
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
