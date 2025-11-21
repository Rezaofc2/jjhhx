/*const axios = require("axios");

module.exports = (app) => {
  

  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      // Memastikan imageUrl dan text diberikan
      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
      if (!text) {
        return res.status(400).json({ status: false, error: "text is required" });
      }

     const imageResponse = await axios.get(`https://apidl.asepharyana.tech/api/ai/image/gemini?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`,
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
}*/

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
      // Jika API mengembalikan body yang bisa dibaca, sertakan pesan singkat
      const msg = error.response && error.response.data
        ? `Upstream error: ${error.response.status}`
        : error.message;
      res.status(500).json({ status: false, error: msg });
    }
  });
};
