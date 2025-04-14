const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://an1.com';

const android1 = {
  detail: async (url) => {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const title = $('h1.title.xxlgf').text();
      const imageUrl = $('figure.img img').attr('src');
      const developer = $('.developer[itemprop="publisher"] span').text();
      const descriptionElement = $('.description #spoiler').html();
      const description = descriptionElement ? descriptionElement.replace(/<[^>]*>/g, '') : 'N/A';
      const version = $('span[itemprop="softwareVersion"]').text();
      const fileSize = $('span[itemprop="fileSize"]').text();
      const operatingSystem = $('span[itemprop="operatingSystem"]').text();
      const ratingElement = $('#ratig-layer-4959 .current-rating').css('width');
      const rating = ratingElement ? parseFloat(ratingElement.replace('%', '')) / 20 : 0;
      const ratingCount = $('#vote-num-id-4959').text();
      const downloadUrl = $('.download_line.green').attr('href');
      const screenshots = [];

      $('.app_screens_list a').each((index, element) => {
        const screenshotUrl = $(element).find('img').attr('src');
        if (screenshotUrl) screenshots.push(screenshotUrl);
      });

      const appInfo = {
        title: title || 'N/A',
        imageUrl: imageUrl || '',
        developer: developer || 'N/A',
        description: description,
        version: version || 'N/A',
        fileSize: fileSize || 'N/A',
        operatingSystem: operatingSystem || 'N/A',
        rating: rating,
        ratingCount: ratingCount || '0',
        downloadUrl: baseUrl + downloadUrl || '',
        screenshots: screenshots
      };

      console.log('Data:', appInfo);
      return appInfo;
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.message };
    }
  },

  download: async (url) => {  // Changed 'urls' to 'url' for consistency
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const title = $('.box-file h1.title.fbold').text() || 'N/A';
      const image = $('.box-file-img img').attr('src') || '';
      const version = $('#a_ver').text().trim() || 'N/A';
      const downloadUrl = $('#pre_download').attr('href') || '';

      const downloadInfo = {
        title: title,
        imageUrl: image,
        version: version,
        downloadUrl: downloadUrl
      };

      console.log('Data:', downloadInfo);
      return downloadInfo;
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.message };
    }
  }
};

module.exports = (app) => {
  app.get("/downloader/android1", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ status: false, error: "Url is required" });
      }

      const appDetails = await android1.detail(url);
      if (!appDetails.downloadUrl) {
        return res.status(500).json({ status: false, error: appDetails.message });
      }

      const downloadInfo = await android1.download(appDetails.downloadUrl);
      res.status(200).json({ status: true, result: downloadInfo }); // Fixed JSON syntax
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
}