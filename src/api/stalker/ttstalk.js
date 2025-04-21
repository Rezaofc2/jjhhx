const axios = require("axios");
const cheerio = require("cheerio");
module.exports = (app) => {
async function tiktokStalk(username) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        const parsedData = JSON.parse(scriptData);

        const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        if (!userDetail) {
            throw new Error('user tidak ditemukan');
        }

        const userInfo = userDetail.userInfo?.user;
        const stats = userDetail.userInfo?.stats;

        const metadata = {
            
                id: userInfo?.id || null,
                username: userInfo?.uniqueId || null,
                nama: userInfo?.nickname || null,
                avatar: userInfo?.avatarLarger || null,
                bio: userInfo?.signature || null,
                verifikasi: userInfo?.verified || false,
                totalfollowers: stats?.followerCount || 0,
                totalmengikuti: stats?.followingCount || 0,
                totaldisukai: stats?.heart || 0,
                totalvideo: stats?.videoCount || 0,
                totalteman: stats?.friendCount || 0,
            
        };

        return JSON.stringify(metadata, null, 2);
    } catch (error) {
        return error.message;
    }
}

  app.get("/stalker/ttstalk", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ status: false, error: "Query is required" });
      }
      const data = await tiktokStalk(q);
      const result = data
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      console.error("Error in /stalker/ttstalk:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
