const multer = require('multer')
const { multipleFileStorage, singleFileStorage } = require('../utils/imageStorage')


function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image')) {
    cb('not a image type file', false);
  } else {
    cb(null, true);
  }
}

const singleUpload = multer(
  {
    storage: singleFileStorage, limits: {
      files: 1, // allow up to 5 files per request,
      fileSize: process.env.MAX_IMAGE_SIZE * 1024 * 1024  // 2 MB (max file size)
    },
    fileFilter: fileFilter
  }
).single('file')



const multipleUpload = multer(
  {
    storage: multipleFileStorage, limits: {
      files: 3,
      fileSize: process.env.MAX_IMAGE_SIZE * 1024 * 1024  // 2 MB (max file size)
    },
    fileFilter: fileFilter
  }
).array('multiple', process.env.MAX_IMAGE_UPLOAD)



function mySingleUpload(req, res, next) {
  singleUpload(req, res, function (err) {
    if (!req.file && !err) {
      return res.status(400).send({ success: false, code: 400, message: 'please add a image file' })
    }
    if (err) {
      return res.status(400).send({
        success: false,
        code: 400,
        maxSize: `${process.env.MAX_IMAGE_SIZE}MB`,
        message: err.message || err
      })
    }
    next();
  })
}

function myMultipleUpload(req, res, next) {
  multipleUpload(req, res, function (err) {
    if (req.files.length === 0 && !err) {
      return res.status(400).send({ success: false, code: 400, message: 'please add atleast 1 image file' })
    }
    if (err) {
      return res.status(400).send({
        success: false,
        code: 400,
        required: {
          maxSize: `${process.env.MAX_IMAGE_SIZE}MB`,
          maxUpload: `${process.env.MAX_IMAGE_UPLOAD}`
        },
        message: err.message || err
      })
    }
    next();
  })
}









module.exports.mySingleUpload = mySingleUpload
module.exports.myMultipleUpload = myMultipleUpload