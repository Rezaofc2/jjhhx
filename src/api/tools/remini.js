const axios = require("axios")

module.exports = (app) => {
    app.get("/tools/remini", async (req, res) => {
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
            } = await axios.get("https://api.malik-jmk.web.id/api/tools/upscale/v17?imageUrl=" + imageUrl)
            res.status(200).json({
                status: true,
                result: data
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    })
}