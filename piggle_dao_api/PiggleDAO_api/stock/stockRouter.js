// express.Router를 사용하기 위해 express exports를 가져옴!
const express = require("express");
const stock = require("./stock");

// Router를 사용하기 위해 express.Router()호출
const router = express.Router();

// 외부에서 사용하기 위해 router를 넣어줌!
module.exports = router;


// 주식정보 조회
router.get('/selectStockInfo', async function(req,res){  
    try{
        const stockCode = req.query.stock_code

        const result = await stock.selectStockInfo(stockCode);
        res.send(result);
    } catch(err) {
        res.send(err);
    }
});