const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {
    async function xboxStalk(teks) {
        try {
            const { data } = await axios.get('https://xboxgamertag.com/search/' + teks);
            const $ = cheerio.load(data);

            let gamerscore = 0;
            let gamesPlayed = 0;

            // Mengambil informasi profil
            $('.profile-detail-item').each((index, element) => {
                const title = $(element).find('span').text();
                const value = $(element).text().replace(title, '').trim();

                if (title.includes("Gamerscore")) {
                    gamerscore = parseInt(value.replace(/,/g, ''), 10) || 0;
                }
                if (title.includes("Games Played")) {
                    gamesPlayed = parseInt(value, 10) || 0;
                }
            });

            const gamertag = {
                name: $('h1 a').text(),
                avatar: $('.avatar img').attr('src'),
                gamerscore: gamerscore,
                gamesPlayed: gamesPlayed,
                gameHistory: []
            };

            // Mengambil riwayat permainan
            $('.recent-games .game-card').each((index, element) => {
                const game = {
                    title: $(element).find('h3').text(),
                    lastPlayed: $(element).find('.text-sm').text().replace('Last played ', ''),
                    platforms: $(element).find('.text-xs').text(),
                    gamerscore: $(element).find('.badge:contains("Gamerscore")').parent().next().text().trim(),
                    achievements: $(element).find('.badge:contains("Achievements")').parent().next().text().trim(),
                    progress: ($(element).find('.progress-bar').attr('style') || 'width: 0%;').match(/width: (.*?);/)[1] || '0%'
                };
                gamertag.gameHistory.push(game);
            });

            return gamertag;
        } catch (error) {
            return { error: error.message }; // Mengembalikan objek dengan pesan kesalahan
        }
    }

    app.get("/stalker/xboxstalk", async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ status: false, error: "Query is required" });
            }

            const data = await xboxStalk(q);
            if (data.error) {
                return res.status(500).json({ status: false, error: data.error });
            }

            res.status(200).json({
                status: true,
                result: data,
            });
        } catch (error) {
            console.error("Error in /stalker/xboxstalk:", error); // Logging untuk kesalahan
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
