const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

module.exports = (app) => {
  async function jadwalTV(name) {
	let list = JSON.parse(fs.readFileSync('./json/jadwaltv.json', 'utf-8'))
	let data = list.find((v) => (new RegExp(name, 'gi')).test(v.channel)), result = []
	if (!data) throw 'List Channel Yg Tersedia:\n\n' + list.map(v => v.channel).sort().join('\n')
	let html = (await axios.get(`https://www.jadwaltv.net/${data.isPay ? 'jadwal-pay-tv/' : ''}${data.value}`)).data
	let $ = cheerio.load(html)
	$('div > table.table').find('tbody > tr').slice(1).each(function () {
		let jam = $(this).find('td').eq(0).text()
		let acara = $(this).find('td').eq(1).text()
		if (!/Jadwal TV/gi.test(acara) && !/Acara/gi.test(acara)) result.push({ jam, acara })
	})
	return { channel: data.channel.toUpperCase(), result }
}

  app.get("/info/jadwaltv", async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }
    try {
      const jdwal = await jadwalTV(q);
      res.status(200).json({
        status: true,
        result: jdwal,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
