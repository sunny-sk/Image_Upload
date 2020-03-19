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
  res.send("submitted file")
})
app.post('/multiple', myMultipleUpload, function (req, res) {
  res.send("submitted file")
})

app.listen(process.env.PORT, () => {
  console.log(
    `Server started at ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
