const axios = require("axios");
const FormData = require("form-data");

module.exports = (app) => {
  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      // Validasi input
      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
      if (!text) {
        return res.status(400).json({ status: false, error: "text is required" });
      }

      // Cek apakah URL gambar valid
      try {
        new URL(imageUrl);
      } catch (e) {
        return res.status(400).json({ status: false, error: "Invalid imageUrl format" });
      }

      // Download gambar sebagai stream
      const imageResp = await axios.get(imageUrl, { responseType: "stream" });

      // Siapkan form multipart
      const form = new FormData();
      form.append("image", imageResp.data, {
        filename: "upload.jpg",
        contentType: imageResp.headers["content-type"] || "image/jpeg",
      });
      form.append("param", text);

      // Kirim POST ke API baru
      const apiResp = await axios.post(
        "https://api.elrayyxml.web.id/api/ai/nanobanana",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
          responseType: "arraybuffer",
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      // Forward response image ke client
      const contentType = apiResp.headers["content-type"] || "image/png";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": apiResp.data.length,
      });
      res.end(apiResp.data);
    } catch (error) {
      // Log error untuk debugging
      console.error("Error occurred:", error);

      // Jika API mengembalikan body yang bisa dibaca, sertakan pesan singkat
      const msg = error.response && error.response.data
        ? `Upstream error: ${error.response.status}`
        : error.message;

      res.status(500).json({ status: false, error: msg });
    }
  });
};
