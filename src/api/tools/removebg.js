const axios = require("axios")

module.exports = (app) => {
  app.get("/tools/removebg", async (req, res) => {
    try {
      const { url } = req.query

      if (!url) {
        return res.status(400).json({ status: false, error: "Url is required" })
      }

      const { data } = await axios.get(url, { responseType: "arraybuffer" })
      const image = await data.toString("base64")
      const res = await axios.post("https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
        image: `data:image/png;base64,${image}`,
        model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      })
      
      const result = res.data?.replace(`"`, "")
      res.status(200).json({
        status: true,
        result
      })
    } catch (error) {
      res.status(500).json({ status: false, error: error.message })
    }
  })
}

