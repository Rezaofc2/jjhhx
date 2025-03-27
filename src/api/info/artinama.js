const axios = require("axios");
const cheerio = require("cheerio"); // Pastikan untuk mengimpor cheerio

module.exports = (app) => {
  async function artinama(value) {
    return new Promise((resolve, reject) => {
      axios.get(`https://primbon.com/arti_nama.php?nama1=${value}&proses=+Submit%21+`)
        .then(({ data }) => {
          const $ = cheerio.load(data);
          const fetchText = $('#body').text();
          let hasil;

          try {
            const arti = fetchText.split('memiliki arti: ')[1].split('Nama:')[0].trim();
            hasil = {
              status: true,
              result: {
                nama: value,
                arti: arti || "Arti tidak ditemukan", // Menangani jika arti tidak ada
                catatan: 'Gunakan juga aplikasi numerologi Kecocokan Nama, untuk melihat sejauh mana keselarasan nama anda dengan diri anda.'
              }
            };
          } catch (error) {
            hasil = {
             
              message: `Tidak ditemukan arti nama "${value}". Cari dengan kata kunci yang lain.`
            };
          }
          resolve(hasil);
        })
        .catch((error) => {
          reject({
           
            message: `Terjadi kesalahan saat mengambil data: ${error.message}`
          });
        });
    });
  }

  app.get("/info/artinama", async (req, res) => {
    try {
      const { nama } = req.query;
      if (!nama) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const result = await artinama(nama);
      res.status(200).json(result); // Mengembalikan hasil langsung
    } catch (error) {
      console.error("Error in /info/artinama:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
