// https://www.tiny.cloud/blog/bootstrap-image-upload/
const express = require("express");
const server = express(); // 추가
const path = require('path');


const multer = require("multer"); // for img
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images') // /var/www/html/test-nodejs/images 폴더
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage})

var router = express.Router();

// upload.single('image')
server.post("/upload", upload.single('image'), (req, res) => {
    console.log("안녕"+req.headers.origin);
    var url = `${req.headers.origin}/${req.file.path}`;
    console.log("전"+url);
    url = url.replace("\/public", "");
    console.log("후"+url);
    res.send({
        location: url,
    });

});




server.use(router); // 야매
module.exports = server;