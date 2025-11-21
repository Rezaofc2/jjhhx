import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";

// Membuat string acak
const uid = () =>
  Math.random().toString(36).substring(2) +
  Math.random().toString(36).substring(2);

// Instance axios dengan header default
const ins = axios.create({
  baseURL: "https://api.grid.plus/v1",
  headers: {
    "user-agent":
      "Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0",
    "X-AppID": "808645",
    "X-Platform": "h5",
    "X-Version": "8.9.7",
    "X-SessionToken": "",
    "X-UniqueID": uid(),
    "X-GhostID": uid(),
    "X-DeviceID": uid(),
    "X-MCC": "id-ID",
    sig: `XX${uid() + uid()}`,
  },
});

// Membuat FormData dari object
const form = (dt) => {
  const f = new FormData();
  Object.entries(dt).forEach(([key, value]) => {
    f.append(key, String(value));
  });
  return f;
};

// Upload buffer ke server
const upload = async (buff, method) => {
  if (!Buffer.isBuffer(buff)) throw new Error("Data is not a valid buffer!");
  const fileInfo = await fileTypeFromBuffer(buff);
  if (!fileInfo) throw new Error("Unable to detect file type!");
  const { mime, ext } = fileInfo;

  const d = await ins
    .post("/ai/web/nologin/getuploadurl", form({ ext, method }))
    .then((i) => i.data);

  if (!d?.data?.upload_url || !d?.data?.img_url)
    throw new Error("Upload URL not received from server!");

  await axios.put(d.data.upload_url, buff, {
    headers: { "content-type": mime },
  });

  return d.data.img_url;
};

// Polling task sampai selesai
const task = async ({ path, data, sl = () => false }) => {
  const [start, interval, timeout] = [Date.now(), 3000, 60000];
  return new Promise((resolve, reject) => {
    const check = async () => {
      if (Date.now() - start > timeout) {
        return reject(new Error(`Polling timed out for path: ${path}`));
      }
      try {
        const dt = await ins({
          url: path,
          method: data ? "POST" : "GET",
          ...(data ? { data } : {}),
        });
        if (!!dt.errmsg?.trim())
          return reject(new Error(`Error message: ${dt.errmsg}`));
        if (!!sl(dt.data)) return resolve(dt.data);
        setTimeout(check, interval);
      } catch (error) {
        reject(error);
      }
    };
    check();
  });
};

// Edit gambar dengan prompt
const edit = async (buff, prompt) => {
  const up = await upload(buff, "wn_aistyle_nano");
  const dn = await ins
    .post("/ai/nano/upload", form({ prompt, url: up }))
    .then((i) => i.data);
  if (!dn.task_id) throw new Error("taskId not found on request!");
  const res = await task({
    path: `/ai/nano/get_result/${dn.task_id}`,
    sl: (dt) => dt.code === 0 && !!dt.image_url,
  });
  return res.image_url;
};

// Route express
export default (app) => {
  app.get("/ai/gemini-canvas", async (req, res) => {
    try {
      const { text, imageUrl } = req.query;

      if (!imageUrl) {
        return res
          .status(400)
          .json({ status: false, error: "imageUrl is required" });
      }
      if (!text) {
        return res
          .status(400)
          .json({ status: false, error: "text is required" });
      }

      // Ambil gambar dari URL
      const imgResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imgBuffer = Buffer.from(imgResponse.data);

      // Proses dengan fungsi edit
      const resultUrl = await edit(imgBuffer, text);

      // Ambil hasil gambar dari resultUrl
      const finalImage = await axios.get(resultUrl, {
        responseType: "arraybuffer",
      });

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
