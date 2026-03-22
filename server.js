const express = require("express")
const multer = require("multer")
const { exec } = require("child_process")
const path = require("path")

const app = express()

// Upload storage
const upload = multer({ dest: "uploads/" })

// Static folder (Public with capital P)
app.use(express.static("Public"))

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"))
})

// Upload route
app.post("/upload", upload.single("video"), (req, res) => {

  const input = req.file.path
  const output = "output/reel.mp4"

  const command = `
  ffmpeg -i ${input} -vf "
  scale=1080:1920,
  drawtext=text='Workout Routine':x=(w-text_w)/2:y=50:fontsize=60:fontcolor=white,
  drawtext=text='1. Jumping Jacks':x=50:y=200:fontsize=40:fontcolor=white,
  drawtext=text='2. Reverse Lunge':x=50:y=260:fontsize=40:fontcolor=white,
  drawtext=text='3. Lateral Step Squat':x=50:y=320:fontsize=40:fontcolor=white,
  drawtext=text='4. Squat + Floor Tap':x=50:y=380:fontsize=40:fontcolor=white,
  drawtext=text='5. Squat Calf Raise':x=50:y=440:fontsize=40:fontcolor=white,
  drawtext=text='6. Paused Squat':x=50:y=500:fontsize=40:fontcolor=white,
  drawtext=text='%{eif\\\\:30-t\\\\:d}':x=(w/2):y=(h/2):fontsize=100:fontcolor=yellow
  " ${output}
  `

  exec(command, (err) => {

    if (err) {
      console.log(err)
      res.send("Error generating reel")
    } else {
      res.download(output)
    }

  })

})

// Render dynamic port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
