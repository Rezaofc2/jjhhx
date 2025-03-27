const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
  async function detailresep(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(query);
        const $ = cheerio.load(data);
        const abahan = [];
        const atakaran = [];
        const atahap = [];

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each((_, b) => {
          abahan.push($(b).text());
        });

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each((_, d) => {
          atakaran.push($(d).text());
        });

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each((_, f) => {
          atahap.push($(f).text());
        });

        const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text();
        const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text();
        const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1];
        const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1];
        const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src');

        const tbahan = abahan.map((b, i) => `${b} ${atakaran[i]}`).join('\n');
        const ttahap = atahap.join('\n\n');

        const result = {
          data: {
            judul,
            waktu_masak: waktu,
            hasil,
            tingkat_kesulitan: level,
            thumb,
            bahan: tbahan,
            langkah_langkah: ttahap,
          },
        };

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  app.get("/search/cariresep-detail", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ status: false, error: "URL is required" });
      }
      const result = await detailresep(url);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in /search/cariresep-detail:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
