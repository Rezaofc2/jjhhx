const axios = require("axios")

module.exports = (app) => {
    app.get("/tools/remini", async (req, res) => {
        try {
            const {
                url
            } = req.query

            if (!url) {
                return res.status(400).json({
                    status: false,
                    error: "Url is required"
                })
            }

            const {
                data
            } = await axios.get("https://api.malik-jmk.web.id/api/tools/upscale/v17?imageUrl=" + url)
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