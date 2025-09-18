const axios = require("axios");

module.exports = (app) => {
    app.get("/ai/toanime", async (req, res) => {
        try {
            const { imageUrl } = req.query;

            // Memastikan imageUrl ada
            if (!imageUrl) {
                return res.status(400).json({
                    success: false,
                    error: "imageUrl is required"
                });
            }

            // Mengambil data dari API
            const response = await axios.get(`https://anabot.my.id/api/ai/toAnime`, {
                params: {
                    imageUrl,
                    apikey: 'freeApikey'
                }
            });

            // Memeriksa apakah respons dari API sukses
            if (response.data && response.data.success) {
                return res.status(200).json({
                    success: true,
                    result: response.data.data.result
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: response.data.error || "Failed to process the image"
                });
            }
        } catch (error) {
            // Menangani kesalahan yang terjadi saat memanggil API
            console.error("Error fetching from API:", error.message);
            return res.status(500).json({
                success: false,
                error: "An error occurred while processing your request"
            });
        }
    });
};
