const express = require("express")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
const path = require("path")

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const app = express()

const upload = multer({ dest: "uploads/" })

app.use(express.static("Public"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"))
})

app.post("/upload", upload.single("video"), (req, res) => {

  const input = req.file.path
  const output = "output/reel.mp4"

  ffmpeg(input)
    .videoFilters([
      "scale=1080:1920",
      "drawtext=text='Workout Routine':x=(w-text_w)/2:y=50:fontsize=60:fontcolor=white"
    ])
    .save(output)
    .on("end", () => {
      res.download(output)
    })
    .on("error", (err) => {
      console.log(err)
      res.send("Error generating reel")
    })

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
