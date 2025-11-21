import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";

class GridPlus {
    constructor() {
        this.ins = axios.create({
            baseURL: "https://api.grid.plus/v1",
            headers: {
                "user-agent": "Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0",
                "X-AppID": "808645",
                "X-Platform": "h5",
                "X-Version": "8.9.7",
                "X-SessionToken": "",
                "X-UniqueID": this.uid(),
                "X-GhostID": this.uid(),
                "X-DeviceID": this.uid(),
                "X-MCC": "id-ID",
                sig: `XX${this.uid() + this.uid()}`
            }
        });
    }

    uid() {
    // Membuat string acak dengan panjang tertentu
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2);
}

    form(dt) {
        const form = new FormData();
        Object.entries(dt).forEach(([key, value]) => {
            form.append(key, String(value));
        });
        return form;
    }

    async upload(buff, method) {
        if (!Buffer.isBuffer(buff)) throw new Error("Data is not a valid buffer!");
        const fileInfo = await fileTypeFromBuffer(buff);
        if (!fileInfo) throw new Error("Unable to detect file type!");
        const { mime, ext } = fileInfo;

        const d = await this.ins.post("/ai/web/nologin/getuploadurl", this.form({ ext, method }))
            .then(i => i.data);

        if (!d?.data?.upload_url || !d?.data?.img_url)
            throw new Error("Upload URL not received from server!");

        await axios.put(d.data.upload_url, buff, {
            headers: { "content-type": mime }
        });

        return d.data.img_url;
    }

    async task({ path, data, sl = () => false }) {
        const [start, interval, timeout] = [Date.now(), 3000, 60000];
        return new Promise((resolve, reject) => {
            const check = async () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`Polling timed out for path: ${path}`));
                }
                try {
                    const dt = await this.ins({
                        url: path,
                        method: data ? "POST" : "GET",
                        ...(data ? { data } : {})
                    });
                    if (!!dt.errmsg?.trim()) return reject(new Error(`Error message: ${dt.errmsg}`));
                    if (!!sl(dt.data)) return resolve(dt.data);
                    setTimeout(check, interval);
                } catch (error) {
                    reject(error);
                }
            };
            check();
        });
    }

    async edit(buff, prompt) {
        const up = await this.upload(buff, "wn_aistyle_nano");
        const dn = await this.ins.post("/ai/nano/upload", this.form({ prompt, url: up }))
            .then(i => i.data);
        if (!dn.task_id) throw new Error("taskId not found on request!");
        const res = await this.task({
            path: `/ai/nano/get_result/${dn.task_id}`,
            sl: (dt) => dt.code === 0 && !!dt.image_url
        });
        return res.image_url;
    }
}

export default (app) => {
    app.get("/ai/gemini-canvas", async (req, res) => {
        try {
            const { text, imageUrl } = req.query;

            if (!imageUrl) {
                return res.status(400).json({ status: false, error: "imageUrl is required" });
            }
            if (!text) {
                return res.status(400).json({ status: false, error: "text is required" });
            }

            // Ambil gambar dari URL
            const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            const imgBuffer = Buffer.from(imgResponse.data);

            // Proses dengan GridPlus
            const grid = new GridPlus();
            const resultUrl = await grid.edit(imgBuffer, text);

            // Ambil hasil gambar dari resultUrl
            const finalImage = await axios.get(resultUrl, { responseType: "arraybuffer" });

            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": finalImage.data.length,
            });
            res.end(finalImage.data);

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
