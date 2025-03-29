const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/pornhub", async (req, res) => {
    const { text, text2 } = req.query; // Ambil parameter dari query

    if (!text || !text2) {
      return res.status(400).send("Bad Request: 'text' and 'text2' query parameters are required.");
    }

    try {
      // Memanggil API untuk mendapatkan gambar 
      const imageResponse = await axios.get(
        `https://api.agungny.my.id/api/pornhub?text1=${text}&text2=${text2}`,
        { responseType: "arraybuffer" }
      );

      if (imageResponse.status !== 200) {
        return res.status(imageResponse.status).send("Error fetching image from API.");
      }
      
      let bakir = Buffer.from(imageResponse.data);
      res.writeHead(200, {
        "Content-Type": "image/jpeg", // Tipe konten untuk gambar
        "Content-Length": bakir.length,
      });

      // Mengirimkan data gambar
      res.end(bakir);
    } catch (error) {
      console.error("Error fetching data from API:", error); // Log error untuk debugging
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
