const axios = require("axios");

module.exports = (app) => {
  async function lemonmail(target, subject, messageParts) {
    const data = JSON.stringify({
        "to": target,
        "subject": subject,
        "message": messageParts
    });

    const tm = {
        method: 'POST',
        url: 'https://lemon-email.vercel.app/send-email',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Content-Type': 'application/json',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?1',
            'origin': 'https://lemon-email.vercel.app',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://lemon-email.vercel.app/',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i'
        },
        data: data
    };

    const api = await axios.request(tm);
    return api.data;
}

  app.get("/tools/sendmail", async (req, res) => {
    const { target, subject, messageParts } = req.query;

        if (!target || !subject || !messageParts) {
      return res.status(400).json({ status: false, error: "Yang Bener Donk Formatnya" });
    }

    try {
      const result = await lemonmail(target, subject, messageParts);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
