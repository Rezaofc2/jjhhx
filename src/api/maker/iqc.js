const axios = require("axios");

module.exports = (app) => {
  app.get("/maker/iqc", async (req, res) => {
    try {
      const { time, text} = req.query; 

      
      const imageResponse = await axios.get(`https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=100&carrierName=INDOSAT&messageText=${encodeURIComponent(text.trim())}&emojiStyle=apple`,
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
