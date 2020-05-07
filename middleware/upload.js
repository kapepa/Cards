const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './my-uploads')
  },
  filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

function fileFilter (req, file, cb) {
	if(/\.(jpg|jpeg|png|gif)$/.test(file.originalname)){
		cb(null, true)
	}else{
		cb(null, false)
	}
}

module.exports = multer({ storage, fileFilter })