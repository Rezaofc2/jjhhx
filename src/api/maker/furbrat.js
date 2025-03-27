const axios = require("axios")

module.exports = (app) => {
  app.get("/maker/furbrat", async (req, res) => {
    try {
      const { text, style, model } = req.query

      if (!text || !style || !model) {
        return res.status(400).json({ status: false, error: "Text, style & model are required" })
      }

      // Validasi model hanya bisa "animated" atau "image"
      if (!["animated", "image"].includes(model.toLowerCase())) {
        return res.status(400).json({ status: false, error: 'Invalid model. Use "animated" or "image" only.' })
      }

      // Tentukan Content-Type berdasarkan model
      const contentType = model.toLowerCase() === "animated" ? "image/gif" : "image/png"

      // Validasi style harus angka 1 - 8
      const styleNumber = Number.parseInt(style)
      if (isNaN(styleNumber) || styleNumber < 1 || styleNumber > 8) {
        return res.status(400).json({ status: false, error: "Invalid style. Use a number between 1 and 8." })
      }

      try {
        const response = await axios.get(
          `https://fastrestapis.fasturl.cloud/maker/furbrat?text=${encodeURIComponent(text)}&style=${styleNumber}&position=center&mode=${model}`,
          { responseType: "arraybuffer" },
        )

        // Pastikan respons valid
        if (!response.data || response.data.length === 0) {
          throw new Error("Empty response from external API")
        }

        const buffer = Buffer.from(response.data)

        res.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": buffer.length,
        })
        res.end(buffer)
      } catch (apiError) {
        console.error("API Error:", apiError.message)
        return res.status(502).json({
          status: false,
          error: "Failed to generate media from external API",
          details: apiError.message,
        })
      }
    } catch (error) {
      console.error("Server Error:", error)
      res.status(500).json({ status: false, error: error.message })
    }
  })
}

