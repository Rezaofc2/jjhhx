const axios = require("axios")

module.exports = (app) => {
    app.get("/ai/toanime", async (req, res) => {
        try {
            const {
                imageUrl
            } = req.query

            if (!imageUrl) {
                return res.status(400).json({
                    status: false,
                    error: "imageUrl is required"
                })
            }

            const {
                data
            } = await axios.get("https://anabot.my.id/api/ai/toAnime?imageUrl="+imageUrl+"&apikey=freeApikey")
            res.status(200).json({
                status: true,
                result: data.data.result
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    })
}
