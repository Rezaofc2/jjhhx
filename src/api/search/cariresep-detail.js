const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
  async function detailresep(query) {
    try {
      const { data } = await axios.get(query);
      const $ = cheerio.load(data);
      const abahan = [];
      const atakaran = [];
      const atahap = [];

      // Mengambil bahan
      $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each((_, element) => {
        abahan.push($(element).text().trim());
      });

      // Mengambil takaran
      $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each((_, element) => {
        atakaran.push($(element).text().trim());
      });

      // Mengambil langkah
      $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each((_, element) => {
        atahap.push($(element).text().trim());
      });

      const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text().trim();
      const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text().trim();
      const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().trim().split(': ')[1];
      const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().trim().split(': ')[1];
      const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src');

      const bahan = abahan.map((b, i) => `${b} ${atakaran[i]}`).join('\n');
      const tahap = atahap.join('\n\n');

      const result = {
        creator: 'Fajar Ihsana',
        data: {
          judul,
          waktu_masak: waktu,
          hasil,
          tingkat_kesulitan: level,
          thumb,
          bahan,
          langkah_langkah: tahap,
        },
      };

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch recipe details: ${error.message}`);
    }
  }

  app.get("/search/cariresep-detail", async (req, res) => {
    try {
      const { url } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await detailresep(url);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in /search/cariresep-detail:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
