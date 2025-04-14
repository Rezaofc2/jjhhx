const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://an1.com';
async function search(query) {
    const url = `https://an1.com/?story=${query}&do=search&subaction=search`;
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const items = [];
      $('.item').each((index, element) => {
        const name = $(element).find('.name a span').text();
        const developer = $(element).find('.developer').text();
        const rating = $(element).find('.current-rating').css('width').replace('%', '');
        const imageUrl = $(element).find('.img img').attr('src');
        const link = $(element).find('.name a').attr('href');
        items.push({
          name,
          developer,
          rating: parseFloat(rating) / 20,
          imageUrl,
          link
        });
      });
      console.log('Data:', items);
      return items;
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.message };
    }
  }

module.exports = (app) => {
  app.get("/search/android1", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) { // Memperbaiki dari 'nama' ke 'q'
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await search(q);
      res.status(200).json({status: true, result});
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};