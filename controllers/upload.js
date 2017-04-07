var express = require("express");
var router = express.Router();

var config = require('../config');

var multer = require('multer');

var upload_photo = multer({
    dest: "public/uploads",
    fileFilter: function (request, file, callback) {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('photo');


router.post('/photo', function (req, res, next) {
    upload_photo(req, res, function (err) {
        if (err) {
            return res.status(400).json({error: err.message})
        } else {
            return res.json({file: req.file.filename});
        }
    });
});

module.exports = router;