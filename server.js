const express = require("express")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
const path = require("path")
const fs = require("fs")

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const app = express()

// Create folders if not exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

if (!fs.existsSync("output")) {
  fs.mkdirSync("output")
}

// Multer upload config
const upload = multer({ dest: "uploads/" })

// Static folder (Public)
app.use(express.static("Public"))

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"))
})

// Upload route
app.post("/upload", upload.single("video"), (req, res) => {

  if (!req.file) {
    return res.send("No video uploaded")
  }

  const input = req.file.path
  const output = "output/reel-" + Date.now() + ".mp4"

  console.log("Video uploaded:", input)

  ffmpeg(input)
    .videoFilters([
      "scale=1080:1920"
    ])
    .on("start", (cmd) => {
      console.log("FFmpeg started:", cmd)
    })
    .on("end", () => {
      console.log("Video processing finished")

      res.download(output, () => {

        // delete temp file
        fs.unlinkSync(input)

      })
    })
    .on("error", (err) => {
      console.log("FFmpeg error:", err)
      res.send("Error generating reel")
    })
    .save(output)

})

// Render dynamic port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
