const axios = require("axios");

module.exports = (app) => {
  
  app.get("/ai/figure", async (req, res) => {
    try {
      const { imageUrl } = req.query;

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" });
      }
   let promp = "Make this picture a scale scale scale 1/7, representing realistic style and realistic environment. The statue was placed on a computer desk with a transparent round acrylic base. There is no text at the base. The computer screen shows the modeling process on the figure statue of the image. Next to the computer screen there is a toy box with the same image of the printed printed on it.";
      const imageResponse = await axios.get(`https://apieza.vercel.app/ai/gemini-canvas?text=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}`,
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
