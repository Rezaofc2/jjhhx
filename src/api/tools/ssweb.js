const axios = require("axios");

module.exports = (app) => {
  app.get("/tools/ssweb", async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({ status: false, error: "Url is required" });
      }

      // Mengambil screenshot dari API
      const response = await axios.get(`https://apidl.asepharyana.tech/api/tool/ssweb?url=${url}&mode=desktop`);

      // Mendapatkan URL file gambar dari respons
      const { fileUrl } = response.data;

      if (!fileUrl) {
        return res.status(500).json({ status: false, error: "Failed to retrieve image URL" });
      }

      // Mengambil gambar dari URL yang diberikan
      const imageResponse = await axios.get(fileUrl, { responseType: "arraybuffer" });

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageResponse.data.length,
      });
      res.end(imageResponse.data);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
