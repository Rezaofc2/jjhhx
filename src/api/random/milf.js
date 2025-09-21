const axios = require("axios")

module.exports = (app) => {
  app.get("/random/milf", async (req, res) => {
    try {
      // Memanggil API untuk mendapatkan gambar NSFW Loli
      const imageResponse = await axios.get(
        "https://rynekoo-api.hf.space/random/waifuim/milf",
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

