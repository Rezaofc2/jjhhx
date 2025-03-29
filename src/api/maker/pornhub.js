const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/pronhub", async (req, res) => {
    const { text, text2 } = req.query; // Ambil parameter dari query

    try {
      // Memanggil API untuk mendapatkan gambar atau video NSFW Loli
      const imageResponse = await axios.get(
        `https://api.agungny.my.id/api/pornhub?text1=${text}&text2=${text2}`,
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
