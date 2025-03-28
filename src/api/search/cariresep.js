const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
  async function cariresep(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get('https://resepkoki.id/?s=' + query);
        const $ = cheerio.load(response.data);
        const link = [];
        const judul = [];
        const format = [];

        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function (index, element) {
          link.push($(element).attr('href'));
        });

        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function (index, element) {
          const jud = $(element).text();
          judul.push(jud);
        });

        for (let i = 0; i < link.length; i++) {
          format.push({
            judul: judul[i],
            link: link[i]
          });
        }

        const data = {
        status: true,
          result: format.filter(v => v.link.startsWith('https://resepkoki.id/resep'))
        };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  app.get("/search/cariresep", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) { // Memperbaiki dari 'nama' ke 'q'
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await cariresep(q);
      res.status(200).json(result); // Mengembalikan hasil langsung
    } catch (error) {
      console.error("Error in /search/cariresep:", error); // Menambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
