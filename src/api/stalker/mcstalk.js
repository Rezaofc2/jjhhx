const axios = require("axios");
const cheerio = require("cheerio");
module.exports = (app) => {
async function MinecraftStalk(teks) {
    try {
        const response = await axios.get('https://playerdb.co/api/player/minecraft/' + teks);
        const data = response.data;

        const result = {
            username: data.data.player.username,
            id: data.data.player.id,
            raw_id: data.data.player.raw_id,
            avatar: data.data.player.avatar,
            skin_texture: data.data.player.skin_texture,
            name_history: data.data.player.name_history
        };

        return result;
    } catch (error) {
        return error.message; // Mengembalikan pesan error jika terjadi kesalahan
    }
}

  app.get("/stalker/mcstalk", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const data = await MinecraftStalk(q);
      const result = data
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/mcstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
