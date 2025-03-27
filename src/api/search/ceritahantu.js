const axios = require("axios");
const cheerio = require("cheerio");
module.exports = (app) => {
  async function ceritahantu() {
  const response = await axios.get(
    "https://cerita-hantu-nyata.blogspot.com/search?q=Kentang&m=1",
  );
  const $ = cheerio.load(response.data);

  const popularPosts = [];

  $(".item-content").each((index, element) => {
    const post = {};
    post.title = $(element).find(".item-title a").text();
    post.snippet = $(element).find(".item-snippet").text().trim();
    post.image = $(element).find(".item-thumbnail img").attr("src");
    post.url = $(element).find(".item-title a").attr("href");
    popularPosts.push(post);
  });

  return popularPosts;
}

  app.get("/search/ceritahantu", async (req, res) => {
    try {
      const result = await ceritahantu();
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
