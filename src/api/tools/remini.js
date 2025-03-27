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
            } = await axios.get(url, {
                responseType: "arraybuffer"
            })
            const response = await axios.post(
                "https://lexica.qewertyy.dev/upscale", {
                    image_data: Buffer.from(data, "base64"),
                    format: "binary",
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer",
                }
            );

            let result = Buffer.from(response.data);
            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": result.length,
            })
            res.end(result)
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    })
}