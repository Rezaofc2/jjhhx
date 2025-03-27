const axios = require("axios");
const cheerio = require("cheerio"); // Pastikan untuk mengimpor cheerio

module.exports = (app) => {
  async function tafsir_mimpi(value) {
    return new Promise((resolve, reject) => {
        axios.get('https://primbon.com/tafsir_mimpi.php?mimpi='+value+'&submit=+Submit+')
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
              
                        mimpi: value,
                        arti: fetchText.split(`Hasil pencarian untuk kata kunci: ${value}`)[1].split('\n')[0],
                        solusi: fetchText.split('Solusi -')[1].trim()
                    
                }
            } catch {
                hasil = {
                   
                    message: `Tidak ditemukan tafsir mimpi "${value}" Cari dengan kata kunci yang lain.`
                }
            }
            resolve(hasil)
        })
    })
}

  app.get("/info/artimimpi", async (req, res) => {
    try {
      const { text } = req.query;
      if (!nama) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await tafsir_mimpi(text);
      res.status(200).json(result); // Mengembalikan hasil langsung
    } catch (error) {
      console.error("Error in /info/artimimpi:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
