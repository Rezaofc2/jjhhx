const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/ssweb", async (req, res) => {
    try {
      const { url } = req.query;

      // Memastikan URL diisi
      if (!url) {
        return res.status(400).json({ status: false, error: "Url is required" });
      }

      // Mengambil screenshot dari API
   

    const imageResponse = await axios.get(
       `https://apidl.asepharyana.tech/api/tool/ssweb?url=${encodeURIComponent(url)}&mode=desktop`,
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
};
