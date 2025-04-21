const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
async function list(page = 1) {
  try {
    let { data } = await axios(`https://mcpedl.org/downloading/page/${page}`);
    let $ = cheerio.load(data);

    let result = [];
    $("article.tease.tease-post > section.entry-header-category").each(function() {
      let $$ = $(this);
      let obj = {};
      obj.thumbnail = $$.find("a.post-thumbnail > picture > img").attr("data-src");
      obj.title = $$.find("h2.entry-title").text().trim();
      obj.id = $$.find("h2.entry-title > a").attr("href").split("/").at(-2);
      result.push(obj);
    });

    return result;
  } catch(err) {
    if (err?.response?.status == 404) return {
      error: true,
      message: "Page Not Found"
    };
    throw err;
  }
}

async function download(id) {
  try {
    let { data } = await axios(`https://mcpedl.org/${id}`);
    let $ = cheerio.load(data);

    let __dl = (await axios("https://mcpedl.org/dw_file.php?id=" + $("#download-link > table > tbody > tr > td > a").attr("href").split("/").at(-1))).data;
    let _dl = cheerio.load(__dl);
    let dl = _dl("a").attr("href");

    let result = {};
    result.url = dl;
    result.version = $($("#download-link > table > tbody > tr > td")[0]).text();
    result.size = $($(".entry-footer > .entry-footer-wrapper > .entry-footer-column > .entry-footer-content > span").get(-1)).text();

    return result;
  } catch(err) {
    if (err?.response?.status == 404) return {
      error: true,
      message: "Page Not Found"
    };
    throw err;
  }
}

  app.get("/downloader/mcdl", async (req, res) => {
    try {

   const data = await list();
    const { thumbnail, title, id } = data[0];
    const result = await download(id);

      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/genshinstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
