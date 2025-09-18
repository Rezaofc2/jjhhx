const axios = require("axios");

module.exports = (app) => {
    app.get("/ai/toanime", async (req, res) => {
        try {
            const { imageUrl } = req.query;

            if (!imageUrl) {
                return res.status(400).json({
                    success: false,
                    error: "imageUrl is required"
                });
            }

            const response = await axios.get(`https://anabot.my.id/api/ai/toAnime?imageUrl=${imageUrl}&apikey=freeApikey`);
            
            
                res.status(200).json({
                    success: true,
                    result: response.data.data.result
                });
           
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
};
