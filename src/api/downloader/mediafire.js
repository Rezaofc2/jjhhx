const cheerio = require("cheerio");
const { fetch } = require("undici");

module.exports = (app) => {
  async function mediaFire(url) {
    try {
      const response = await fetch('https://r.jina.ai/' + url);
      const text = await response.text();

      const result = {
        title: (text.match(/Title: (.+)/) || [])[1]?.trim() || '',
        link: (text.match(/URL Source: (.+)/) || [])[1]?.trim() || '',
        filename: '',
        url: '',
        size: '',
        repair: ''
      };

      if (result.link) {
        const fileMatch = result.link.match(/\/([^\/]+\.zip)/);
        if (fileMatch) result.filename = fileMatch[1];
      }

      const matches = [...text.matchAll(/\[(.*?)\]\((https:\/\/[^\s]+)\)/g)];
      for (const match of matches) {
        const desc = match[1].trim();
        const link = match[2].trim();

        if (desc.toLowerCase().includes('download') && desc.match(/\((\d+(\.\d+)?[KMGT]B)\)/)) {
          result.url = link;
          result.size = (desc.match(/\((\d+(\.\d+)?[MG]B)\)/) || [])[1] || '';
        }
        if (desc.toLowerCase().includes('repair')) {
          result.repair = link;
        }
      }

      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  app.get("/downloader/mediafire", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ status: false, error: "URL is required" });
      }
      const result = await mediaFire(url);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
