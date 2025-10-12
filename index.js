const express = require("express")
const chalk = require("chalk")
const fs = require("fs")
const os = require("os")
const axios = require("axios")
const cors = require("cors")
const path = require("path")
const moment = require('moment-timezone')
const app = express()
const PORT = process.env.PORT || 3680

app.enable("trust proxy")
app.set("json spaces", 2)
app.set("json replacer", (key, value) => value)

app.use(express.json({ limit: "100mb" }))
app.use(
  express.urlencoded({
    extended: false,
    limit: "100mb",
  }),
)
app.use(cors())

app.use("/", express.static(path.join(__dirname, "api-page"), { index: false }))

app.use("/src", express.static(path.join(__dirname, "src")))

const settingsPath = path.join(__dirname, "./src/settings.json")
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))

global.totalreq = 0
global.lolkey = "RyApi"

// Middleware untuk log dan format JSON response
app.use((req, res, next) => {
  console.log(chalk.bgHex("#FFFF99").hex("#333").bold(` Request Route: ${req.path} `))
  global.totalreq += 1

  const originalJson = res.json
  res.json = function (data) {
    if (data && typeof data === "object") {
      const responseData = {
        status: data.status,
        creator: settings.apiSettings.creator || "Created Using Skyzo",
        ...data,
      }
      return originalJson.call(this, responseData)
    }
    return originalJson.call(this, data)
  }

  next()
})

const runtime = function(seconds = process.uptime()) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}
global.runtime = runtime
function tanggal (numer) {
	myMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"]
				myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
				var tgl = new Date(numer);
				var day = tgl.getDate()
				bulan = tgl.getMonth()
				var thisDay = tgl.getDay(),
				thisDay = myDays[thisDay];
				var yy = tgl.getYear()
				var year = (yy < 1000) ? yy + 1900 : yy; 
				const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
				let d = new Date
				let locale = 'id'
				let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
				let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
				
				return`${thisDay}, ${day}/${myMonths[bulan]}/${year}`
}


const capital = (string) => {
return string.charAt(0).toUpperCase() + string.slice(1);
}

// Api Route
let totalRoutes = 0
const apiFolder = path.join(__dirname, "./src/api")
fs.readdirSync(apiFolder).forEach((subfolder) => {
  const subfolderPath = path.join(apiFolder, subfolder)
  if (fs.statSync(subfolderPath).isDirectory()) {
    fs.readdirSync(subfolderPath).forEach((file) => {
      const filePath = path.join(subfolderPath, file)
      if (path.extname(file) === ".js") {
        require(filePath)(app)
        totalRoutes++
        console.log(
          chalk
            .bgHex("#FFFF99")
            .hex("#333")
            .bold(` Loaded Route: ${path.basename(file)} `),
        )
      }
    })
  }
})
console.log(chalk.bgHex("#90EE90").hex("#333").bold(" Load Complete! ✓ "))
console.log(chalk.bgHex("#90EE90").hex("#333").bold(` Total Routes Loaded: ${totalRoutes} `))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "home.html"))
})

app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "index.html"))
})

app.get("/contributors", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "contributors.html"))
})

function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 3600))
  const hours = Math.floor((seconds % (24 * 3600)) / 3600)
  const minutes = Math.floor(seconds % 3600) / 60
  const secs = Math.floor(seconds % 60)

  return `${days}d ${hours}h ${minutes}m ${secs}s`
}

app.get("/list_endpoint", async (req, res) => {
  try {
    const settingsPath = path.join("./src/settings.json")
    const settingsData = fs.readFileSync(settingsPath, "utf-8")
    const settings = JSON.parse(settingsData)

    let totalEndpoints = 0
    const endpoints = []

    settings.categories.forEach((category) => {
      category.items.forEach((item) => {
        totalEndpoints++
        endpoints.push({
          name: item.name,
          path: item.path,
        })
      })
    })

    res.json({
      status: true,
      result: {
        totalEndpoints,
        endpoints,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    })
  }
})

app.get("/sysinfo", async (req, res) => {
  try {
    const startTime = Date.now()
    const uptime = formatUptime(os.uptime())

    res.status(200).json({
      status: true,
      hostname: os.hostname() || "Unknown",
      platform: os.platform(),
      arch: os.arch(),
      uptime,
      total_memory: (os.totalmem() / 1024 / 1024).toFixed(2) + " MB",
      free_memory: (os.freemem() / 1024 / 1024).toFixed(2) + " MB",
      cpu_model: os.cpus()[0].model,
      cpu_cores: os.cpus().length,
      latency: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    })
  }
})

app.get('/status', async (req, res) => {
    try {
        // Mengambil data dari /list_endpoint
        const response = await axios.get(`https://apieza.vercel.app/list_endpoint`);
        const totalFitur = response.data.result.totalEndpoints; // Ambil totalEndpoints dari response

        res.status(200).json({
            status: true,
            result: {
                status: "Aktif", 
                totalrequest: global.totalreq.toString(), 
                totalfitur: totalFitur, // Menggunakan totalFitur yang diambil dari /list_endpoint
                runtime: runtime(process.uptime()), 
                domain: req.hostname
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

app.get("/ai", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "ai.html"))
})

app.get("/spotdl", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "spotify.html"))
})

app.get("/ttdl", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "ttdl.html"))
})

app.get("/ytdl", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "ytdl.html"))
})


app.get("/explore", (req, res) => {
  res.redirect("/docs")
})

app.use((req, res, next) => {
  res.status(404).sendFile(process.cwd() + "/api-page/404.html")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(process.cwd() + "/api-page/500.html")
})

app.listen(PORT, () => {
  console.log(chalk.bgHex("#90EE90").hex("#333").bold(` Server is running on port ${PORT} `))
})

module.exports = app
