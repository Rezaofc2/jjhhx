const axios = require("axios");
const FormData = require("form-data");

module.exports = (app) => {
  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
      if (!text) {
        return res.status(400).json({ status: false, error: "text is required" });
      }

      // Download gambar sebagai buffer
      const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imgBuffer = Buffer.from(imageResp.data);

      // Siapkan form multipart
      const form = new FormData();
      form.append("image", imgBuffer, { filename: "image.jpg" });
      form.append("param", text);

      const { data } = await axios.post(`https://api.elrayyxml.web.id/api/ai/nanobanana`, form, {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
        timeout: 180000
      });

      // Mengatur header response
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": data.length,
      });

      // Mengirimkan data gambar
      res.end(data);
    } catch (error) {
      const msg = error.response && error.response.data
        ? `Upstream error: ${error.response.status}`
        : error.message;
      res.status(500).json({ status: false, error: msg });
    }
  });
};
