const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = (app) => {
  async function postid(post) {
    try {
      const response = await fetch("https://kodeposku.com/cari?" + new URLSearchParams({ 
        q: String(post),
        _rsc: "1mart"
      }), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
          rsc: 1,
          "next-url": "/cari",
          "next-router-state-tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22(application)%22%2C%7B%22children%22%3A%5B%22cari%22%2C%7B%22children%22%3A%5B%22__PAGE__%3F%7B%5C%22q%5C%22%3A%5C%227371%5C%22%7D%22%2C%7B%7D%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D"
        }
      });

      // Pastikan respons berhasil
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const dataMatch = /{"villages":(\[(?:{"id":.*?,"kode_kemendagri":".*?,"kode_pos":.*?,"kelurahan":".*?,"kecamatan":".*?,"kota":".*?,"provinsi":".*?,"zona_waktu":".*?,"lintang":.*?,"bujur":.*?,"elevasi":.*?},?)\])/g.exec(text);
      return JSON.parse(dataMatch ? dataMatch[1] : "[]");
    } catch (error) {
      throw error; // Melemparkan kesalahan untuk ditangani di tempat lain
    }
  }

  app.get("/info/kodepos", async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: false, error: "Query is required" });
    }
    try {
      const kode = await postid(q);
      res.status(200).json({
        status: true,
        result: kode,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
