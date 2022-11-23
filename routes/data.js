var express = require('express');
var router = express.Router();

const maria = require('../database/connect/maria');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('데이터 확인');
});

router.get('/stocklist', function(req, res, next) {
    var word = req.query.s;
    var query = "SELECT * FROM stocklist WHERE denote LIKE '%"+word+"%' Limit 6";

    console.log(query);

    maria.query(query, word, function(err, data) {
        if(!err){
            res.json(data);
        } else {
            console.log("err:  "+err);
            res.send(err);
        }
    })
});

router.get('/candlechart', function(req, res, next) {
    var number = req.query.number;
    var query = "SELECT name FROM stocklist WHERE number='"+number+"'";
    console.log(query)

    maria.query(query, number, function(err, data) {
        if(!err){
            res.send(data);
        } else {
            console.log("err:  "+err);
            res.send(err);
        }
    })
});

router.get('/stockinfo', function(req, res, next) {
    res.send('확인중인 종목에 관련된 주식 정보 (오른족 메뉴)');
});



router.post('/write1', function(req, res, next) {
    var stock = req.body.stock;
    var type = req.body.type;
    var date = req.body.date;
    var price = req.body.price;
    var title = req.body.title;
    var html_content = req.body.html_content;
    var discuss = req.body.discuss;

    var values = "'"+stock+"','"+type+"','"+date+"','"+price+"','"+title+"','"+html_content+"','"+discuss+"'";
    var query = "INSERT into board1(stock, type, date, price, title, html_content, discuss) values ("+ values +")";

    console.log("query:"+query);
    maria.query(query, function (err, result) {
        if(!err){
            res.redirect('https://naver.com');
        } else {
            console.log("err:  "+err);
            res.redirect('/vote_stock_active');
        }
    });
});



/** for 노바랜드 */
/** for 노바랜드 */
/** for 노바랜드 */
router.post('/write_novarand', function(req, res, next) {
    var title = req.body.title;
    var html_content = req.body.html_content;

    console.log("입력:"+title+"/"+html_content);

    var query = "INSERT into novarand(title, html_content) values ('"+title+"','"+html_content +"')";

    console.log(query);
    maria.query(query, function (err, result) {
        if(!err){
            res.redirect('https://naver.com');
        } else {
            console.log("err:  "+err);
        }
    });
});

module.exports = router;