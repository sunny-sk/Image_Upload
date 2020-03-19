const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path = require('path')
const multer = require('multer')
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const singleFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/singleFileUpload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})
const multipleFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/multipleFileUpload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})

var singleUpload = multer(
  {
    storage: singleFileStorage, limits: {
      files: 1, // allow up to 5 files per request,
      fileSize: process.env.FILE_SIZE * 1024 * 1024  // 2 MB (max file size)
    },
    fileFilter: fileFilter
  }
).single('file')

var multipleUpload = multer(
  {
    storage: multipleFileStorage, limits: {
      // allow up to 5 files per request,
      files: 3,
      fileSize: process.env.FILE_SIZE * 1024 * 1024  // 2 MB (max file size)
    },
    fileFilter: fileFilter
  }
).array('multiple', 3)





function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image')) {
    cb('not a image type file', false);
  } else {
    cb(null, true);
  }
}

function mySingleUpload(req, res, next) {
  singleUpload(req, res, function (err) {

    if (!req.file && !err) {
      return res.send({ success: false, message: 'please add a image file' })
    }
    if (err) {
      return res.send({
        "success": false,
        "maxSize": `${process.env.FILE_SIZE}MB`,
        message: err.message || err
      })
    }
    next();
  })
}

function myMultipleUpload(req, res, next) {
  multipleUpload(req, res, function (err) {
    if (req.files.length === 0 && !err) {
      return res.send({ success: false, message: 'please add atleast 1 image file' })
    }
    if (err) {
      return res.send({
        "success": false,
        "maxSize": `${process.env.FILE_SIZE}MB`,
        message: err.message || err
      })

    }
    next();
  })
}

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
