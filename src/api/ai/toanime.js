const axios = require("axios")

module.exports = (app) => {
    app.get("/ai/tonime", async (req, res) => {
        try {
            const {
                imageUrl, style
            } = req.query

            if (!imageUrl) {
                return res.status(400).json({
                    status: false,
                    error: "imageUrl is required"
                })
            }

            const {
                data
            } = await axios.get(`https://api.ryzumi.vip/api/ai/toanime?url=${imageUrl}&style=${style}`)
            res.status(200).json({
                status: true,
                result: data.result
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    })
}
