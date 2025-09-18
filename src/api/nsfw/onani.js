let fetch = require('node-fetch')
module.exports = (app) => {
  app.get("/nsfw/onani", async (req, res) => {
    try {



      const result = "https://jerrycoder.oggyapi.workers.dev/msb"
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /nsfw/onani:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
