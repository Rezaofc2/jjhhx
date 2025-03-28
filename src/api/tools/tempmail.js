const axios = require("axios");

class TempMail {
  constructor() {
    this.cookie = null;
    this.baseUrl = "https://tempmail.so";
  }

  async #updateCookie(response) {
    if (response.headers["set-cookie"]) {
      this.cookie = response.headers["set-cookie"].join("; ");
    }
  }

  async #makeRequest(url) {
    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        accept: "application/json",
        cookie: this.cookie || "",
        referer: this.baseUrl + "/",
        "x-inbox-lifespan": "600",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
      },
    });

    await this.#updateCookie(response);
    return response;
  }

  async initialize() {
    const response = await axios.get(this.baseUrl, {
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      },
    });
    await this.#updateCookie(response);
    return this;
  }

  async getInbox() {
    const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
    const response = await this.#makeRequest(url);
    return response.data;
  }

  async getMessage(messageId) {
    const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
    const response = await this.#makeRequest(url);
    return response.data;
  }
}

async function createTempMailInstance() {
  const mail = new TempMail();
  await mail.initialize();
  return mail;
}

module.exports = (app) => {
  let mailInstance;

  // Endpoint untuk membuat email sementara
  app.get("/tools/temp-create", async (req, res) => {
    try {
      if (!mailInstance) {
        mailInstance = await createTempMailInstance();
      }

      const inbox = await mailInstance.getInbox();
      res.json({
        success: true,
        result: inbox,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Endpoint untuk mengecek inbox berdasarkan email
  app.get("/tools/temp-check", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email parameter is required",
        });
      }

      if (!mailInstance) {
        mailInstance = await createTempMailInstance();
      }

      const inbox = await mailInstance.getInbox();

      // Filter email berdasarkan parameter email yang diberikan
      const filteredInbox = inbox.data?.inbox?.filter((msg) => msg.to === email) || [];

      res.json({
        success: true,
        result: {
          email,
          messages: filteredInbox,
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
};