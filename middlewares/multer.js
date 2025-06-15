const multer = require("multer");

const storage = multer.diskStorage({
  filename: function functionName(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
module.exports = upload;
