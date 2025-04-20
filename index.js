const express = require("express")
const chalk = require("chalk")
const fs = require("fs")
const os = require("os")
const axios = require("axios")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3680

app.enable("trust proxy")
app.set("json spaces", 2)

// Configure Express to remove quotes on keys
app.set("json replacer", (key, value) => value)

// Modify the Express configuration to increase the JSON body size limit
app.use(express.json({ limit: "100mb" }))
app.use(
  express.urlencoded({
    extended: false,
    limit: "100mb",
  }),
)
app.use(cors())

// Ubah baris ini:
// app.use("/", express.static(path.join(__dirname, "api-page")))

// Menjadi ini:
app.use("/", express.static(path.join(__dirname, "api-page"), { index: false }))

// Atau alternatif lain, tambahkan opsi untuk tidak menggunakan index.html secara otomatis:
// app.use("/", express.static(path.join(__dirname, "api-page"), { index: false }))
app.use("/src", express.static(path.join(__dirname, "src")))

const settingsPath = path.join(__dirname, "./src/settings.json")
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))

// REMOVED: API key verification middleware - will be implemented in each API file

app.use((req, res, next) => {
  const originalJson = res.json
  res.json = function (data) {
    if (data && typeof data === "object") {
      const responseData = {
        status: data.status,
        creator: settings.apiSettings.creator || "Created Using Rynn UI",
        ...data,
      }
      return originalJson.call(this, responseData)
    }
    return originalJson.call(this, data)
  }
  next()
})

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

// Main route - serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "home.html"))
})

// Documentation route - serve the index page
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

app.get("/runtime", async (req, res) => {
  try {
    const uptime = formatUptime(os.uptime())
    const { data } = await axios.get(
      `https://og.tailgraph.com/og?fontFamily=Poppins&title=Runtime+Server&titleTailwind=font-bold%20text-red-600%20text-7xl&stroke=true&text=Time : ${uptime}&textTailwind=text-red-700%20mt-4%20text-2xl&textFontFamily=Poppins&logoTailwind=h-8&bgUrl=https%3A%2F%2Fwallpaper.dog%2Flarge%2F272766.jpg&bgTailwind=bg-white%20bg-opacity-30&footer=MchaX-Bot&footerTailwind=text-grey-600`,
      {
        responseType: "arraybuffer",
      },
    )
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": data.length,
    })
    res.end(data)
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

// Add this new route after the existing /sysinfo route
app.get("/ai", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "ai.html"))
})

// Add this new route for the explore page
app.get("/explore", (req, res) => {
  // Temporarily redirect to the documentation page
  res.redirect("/docs")
})

// Add this new endpoint to handle AI chat requests
// Update the AI chat endpoint to use the increased limit
app.post("/ai/chat", express.json({ limit: "100mb" }), async (req, res) => {
  try {
    // Get parameters from request body
    const { content, user, imageUrl } = req.body

    if (!content && !imageUrl) {
      return res.status(400).json({
        status: false,
        error: "Either content or image is required",
      })
    }

    if (!user) {
      return res.status(400).json({
        status: false,
        error: "User ID is required",
      })
    }

    const requestData = {
      content: content || "",
      user: user,
      prompt:
        "Nama kamu adalah MchaX, kamu adalah asisten AI yang ramah dan membantu. Kamu dibuat oleh tim MchaX Api's untuk membantu pengguna dengan berbagai pertanyaan dan tugas.",
    }

    // Handle image if provided
    if (imageUrl && imageUrl.startsWith("data:image")) {
      try {
        // Extract base64 data from the data URL
        const base64Data = imageUrl.split(",")[1]
        // Convert base64 to buffer
        requestData.imageBuffer = Buffer.from(base64Data, "base64")

        console.log("Image processed successfully, size:", requestData.imageBuffer.length)
      } catch (imageError) {
        console.error("Error processing image:", imageError)
        return res.status(400).json({
          status: false,
          error: "Failed to process the image: " + imageError.message,
        })
      }
    }

    console.log("Sending request to LuminAI with data:", {
      content: requestData.content,
      user: requestData.user,
      hasImage: !!requestData.imageBuffer,
      imageSize: requestData.imageBuffer ? requestData.imageBuffer.length + " bytes" : "N/A",
    })

    const { data } = await axios.post("https://luminai.my.id", requestData)

    res.status(200).json({
      status: true,
      result: data.result,
    })
  } catch (error) {
    console.error("AI Chat Error:", error)
    res.status(500).json({
      status: false,
      error: error.message || "An error occurred while processing your request",
    })
  }
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
