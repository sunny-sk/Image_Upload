const path = require('path')
const multer = require('multer')

//@desc storage for single image file
const singleFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/singleFileUpload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})

//@desc storage for multiple image file
const multipleFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/multipleFileUpload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})


module.exports.multipleFileStorage = multipleFileStorage
module.exports.singleFileStorage = singleFileStorage