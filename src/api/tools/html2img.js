const axios = require("axios");

module.exports = (app) => {
  async function html2image(html, css = "") {
  try {
    const response = await axios.post(
      "https://htmlcsstoimage.com/demo_run",
      {
        html,
        css,
        console_mode: "",
        url: "",
        selector: "",
        ms_delay: "",
        render_when_ready: "false",
        viewport_height: "",
        viewport_width: "",
        google_fonts: "",
        device_scale: "",
      },
      {
        headers: {
          cookie: "_ga=GA1.2.535741333.1711473772;",
          "x-csrf-token": "pO7JhtS8osD491DfzpbVYXzThWKZjPoXXFBi69aJnlFRHIO9UGP7Gj9Y93xItqiCHzisYobEoWqcFqZqGVJsow",
        },
      }
    );

    return response.data.url ? response.data.url : null;
  } catch (error) {
    return null;
  }
}

  app.get("/tools/htmltoimg", async (req, res) => {
    const { text } = req.query;

    // Memeriksa apakah parameter text ada
    if (!text) {
      return res.status(400).json({ status: false, error: "Parameter text diperlukan" });
    }

    try {
      const result = await html2image(text, ""); // Mengirimkan text sebagai html
      const imgResponse = await axios.get(result, { responseType: "arraybuffer" });
      const imgBuffer = Buffer.from(imgResponse.data);

      res.writeHead(200, {
        "Content-Type": "image/png", // Mengubah tipe konten menjadi png
        "Content-Length": imgBuffer.length,
      });
      res.end(imgBuffer);
      
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
