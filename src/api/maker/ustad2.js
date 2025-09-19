const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/ustad2", async (req, res) => {
    try {
      const { text } = req.query; 

      
      const imageResponse = await axios.get(`https://api.zenzxz.my.id/maker/ustadz2?text=${text}`,
        { responseType: "arraybuffer" },
      )
      // Mengatur header response
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageResponse.data.length,
      })

      // Mengirimkan data gambar
      res.end(imageResponse.data)
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
