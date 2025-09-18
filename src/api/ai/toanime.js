const axios = require("axios")

module.exports = (app) => {
 app.get("/ai/toanime", async (req, res) => {
    try {
      const { imageUrl, style } = req.query;
      const imageResponse = await axios.get(
        `https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`,
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
      console.error(error) // Log error untuk debugging
      res.status(500).send(`Error: ${error.message}`)
    }
  })
}
