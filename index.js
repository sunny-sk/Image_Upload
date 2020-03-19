const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config({ path: "./config/config.env" });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



//Middleware
const { mySingleUpload, myMultipleUpload } = require('./middleware/uploadImage')


//routes
app.post('/single', mySingleUpload, function (req, res) {
  const imageUrl = `http://${req.hostname}:${process.env.PORT}/${process.env.SINGLE_UPLOAD_FOLDER_NAME}/${req.file.filename}`
  res.status(200).send({ success: true, code: 200, imgUrl: imageUrl })
})

app.post('/multiple', myMultipleUpload, function (req, res) {
  const imgUrls = []
  req.files.forEach((file) => {
    imgUrls.push({ path: `http://${req.hostname}:${process.env.PORT}/${process.env.MULTIPLE_UPLOAD_FOLDER_NAME}/${file.filename}` }
    )
  })
  res.status(200).send({ success: true, code: 200, imgUrls: imgUrls })
})

app.listen(process.env.PORT, () => {
  console.log(
    `Server started at ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
