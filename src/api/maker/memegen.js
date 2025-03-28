const axios = require("axios");

module.exports = (app) => {
  async function memegen(text, text2, url) {
    try {
      const response = await axios.get(`https://api.memegen.link/images/custom/${text}/${text2}.png?background=${url}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meme data:", error);
      throw new Error("Unable to fetch meme data");
    }
  }

  app.get("/maker/memegen", async (req, res) => {
    const { text, text2, url } = req.query;

    // Memeriksa apakah parameter text dan text2 ada
    if (!text || !text2) {
      return res.status(400).json({ status: false, error: "Both text and text2 are required" });
    }

    try {
      const result = await memegen(text, text2, url);
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
