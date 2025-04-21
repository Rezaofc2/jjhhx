const axios = require("axios");
const cheerio = require("cheerio"); // Pastikan untuk mengimpor cheerio

module.exports = (app) => {
  async function HentaiTv(quwary) {
return new Promise((resolve, reject) => {
axios.get("https://hentai.tv/?s=" + quwary).then(async ({ data }) => {
let $ = cheerio.load(data)
let results = []

$('div.flex > div.crsl-slde').each(function (a, b) {
let _thumb = $(b).find('img').attr('src')
let _title = $(b).find('a').text().trim()
let _views = $(b).find('p').text().trim()
let _link = $(b).find('a').attr('href')
let hasil = { thumbnail: _thumb, title: _title, views: _views, url: _link }
results.push(hasil)
})
resolve(results)
}).catch(err => {
console.log(err)
})
})
}

  app.get("/nsfw/hentaitv", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await HentaiTv(q);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /nsfw/hentaitv:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
