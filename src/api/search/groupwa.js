const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
  async function groupwa(query) {
    try {
      const response = await axios.get(`https://groupsor.link/group/searchmore/${query}`);
      const html = response.data;
      const $ = cheerio.load(html);
      const groups = [];

      // Loop untuk mengumpulkan setiap grup dari hasil pencarian
      const groupPromises = $('.maindiv').map(async (index, element) => {
        const groupLink = $(element).find('a').first().attr('href');
        const groupData = await getname(groupLink);

        return {
          link: groupLink,
          name: groupData.title || 'Tidak ada nama',
          description: $(element).find('.descri').text().trim(),
          joinLink: 'https://chat.whatsapp.com/invite/' + $(element).find('.joinbtn a').attr('href').split('/')[5],
          image: groupData.image || 'Tidak ada gambar',
          date: groupData.date || 'Tidak diketahui'
        };
      }).get();

      // Menunggu semua promise selesai
      const groupResults = await Promise.all(groupPromises);
      return groupResults;

    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  async function getname(url) {
    try {
      const response = await axios.get(url);
      if (!response.status === 200) throw new Error(`HTTP error! Status: ${response.status}`);

      const html = response.data;
      const $ = cheerio.load(html);

      const result = {
        image: $('img.proimg').attr('src'),
        title: $('b').text().trim(),
        date: $('span.cate').last().text().trim(),
        description: $('.predesc').text().trim(),
        joinLink: $('a.btn').attr('href')
      };

      return result;

    } catch (error) {
      console.error('Error fetching group details:', error);
      return {};
    }
  }

  app.get("/search/groupwa", async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }
    try {
      const groupResults = await groupwa(q);
      res.status(200).json({
        status: true,
        result: groupResults,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
