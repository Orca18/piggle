// 스케줄러 등록
require("./piggle_dao_api/PiggleDAO_api/scheduler/scheduler");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const busboy = require('connect-busboy');

/*for ssl*/
var fs = require('fs');
var http = require('http');
var https = require('https');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
var serverRouter = require('./routes/server');


const smartcontrctRouter = require("./piggle_dao_api/PiggleDAO_api/smartcontract/smartcontractRouter.js");
const userInfoRouter = require("./piggle_dao_api/PiggleDAO_api/userInfo/userInfoRouter");
const forecastRouter = require("./piggle_dao_api/PiggleDAO_api/forecast/forecastRouter");
const communicationOperationRouter = require("./piggle_dao_api/PiggleDAO_api/communityOperation/communicationOperationRouter");
const analysisRouter = require("./piggle_dao_api/PiggleDAO_api/analysis/analysisRouter");
const commentRouter = require("./piggle_dao_api/PiggleDAO_api/comment/commentRouter");
const tokenRouter = require("./piggle_dao_api/PiggleDAO_api/token/tokenRouter");
const stockRouter = require("./piggle_dao_api/PiggleDAO_api/stock/stockRouter");

var app = express();

const maria = require('./database/connect/maria');
maria.connect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// html 사용
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 위치 설정
// form데이터와 multipart를 처리하기 위해 사용
app.use(busboy());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);
app.use('/server', serverRouter); // 이미지 업로드용

app.use("/smartcontrct", smartcontrctRouter);
app.use("/userinfo", userInfoRouter);
app.use("/forecast", forecastRouter);
app.use("/communicationOperation", communicationOperationRouter);
app.use("/analysis", analysisRouter);
app.use("/comment", commentRouter);
app.use("/token", tokenRouter);
app.use("/stock", stockRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log("에러발생: " + err)
    res.status(err.status || 500);
    res.render('error');
});


/* ssl */
var options = {
    key : fs.readFileSync('/var/www/html/test-nodejs/cert/key.pem'),
    cert : fs.readFileSync('/var/www/html/test-nodejs/cert/cert.pem'),
    ca : fs.readFileSync('/var/www/html/test-nodejs/cert/csr.pem')
}

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(80);
httpsServer.listen(443);

module.exports = app;
