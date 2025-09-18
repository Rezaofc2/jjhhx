const cheerio = require("cheerio");
const { fetch } = require("undici");

module.exports = (app) => {
  
  app.get("/downloader/mediafire", async (req, res) => {
    try {
      const { url } = req.query;
      let response = await fetch(`https://izumiiiiiiii.dpdns.org/downloader/mediafire?url=${url}`);
      let data = await response.json();

      // Mengakses data
      if (!data.status || !data.result) throw new Error("File data not found");

      let fileData = data.result;
      res.status(200).json({
        status: true,
        result: fileData, // Menggunakan fileData di sini
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
