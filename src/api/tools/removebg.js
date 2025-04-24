const axios = require("axios")

module.exports = (app) => {
  app.get("/tools/removebg", async (req, res) => {
    try {
      const { imageUrl } = req.query

      if (!imageUrl) {
        return res.status(400).json({ status: false, error: "imageUrl is required" })
      }
      
      const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" })
      const image = await data.toString("base64")
      const puqi = await axios.post("https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
        image: `data:image/png;base64,${image}`,
        model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      })
      
      const result = puqi.data?.replace(`"`, "")
      let suki = await axios.get(result, { responseType: 'arraybuffer' })
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": suki.data.length,
      })
      res.end(suki.data)
    } catch (error) {
      res.status(500).json({ status: false, error: error.message })
    }
  })
}

