var express = require('express');

var router = express.Router();

const maria = require('../database/connect/maria');

/*  인덱스 페이지
    조회 데이터: 분석글 랭킹 리스트 */
router.get('/', function (req, res, next) {
    // 랭킹 1-10위 글
    return axios.get('http://localhost:3000/analysis/selectAnalysisPostList',{params: {"is_ranking_post" : 'y'}}, null)  
    .then(function (response) {
        console.log(response.data.analysis_post_list);
        //res.send(response.data)
        res.render('index.ejs',{postList: response.data.analysis_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

/*  인덱스 페이지
    조회 데이터: 분석글 랭킹 리스트 */
router.get('/index', function (req, res, next) {
    // 랭킹 1-10위 글
    return axios.get('http://localhost:3000/analysis/selectAnalysisPostList',{params: {"is_ranking_post" : 'y'}}, null)  
    .then(function (response) {
        console.log(response.data.analysis_post_list);
        //res.send(response.data)
        res.render('index.ejs',{postList: response.data.analysis_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

router.get('/chart', function (req, res, next) {

    var word = req.query.n;
    var query = "SELECT * FROM stockinfo WHERE name = '" + word + "'";

    console.log('n=' + word + ' 흠: ' + query);

    maria.query(query, function (err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('chart.ejs', {list: rows});
    })
});

router.get('/blank', function (req, res, next) {
    res.render('blank.ejs')
});

/*  프로필 페이지
    조회 데이터: 1) 프로필 정보, 2) 내가 작성한 글 리스트 */
router.get('/profile', async function (req, res, next) {
    // query: {user_addr: 사용자계정주소, search_page: 조회할 페이지 번호}

    let userInfo = {};

    // 사용자 정보
    return await axios.get('http://localhost:3000/userInfo/selectUserInfo',{params: req.query}, null)  
    .then(async function (response) {
        userInfo.user_name = response.data.userInfo.user_name;
        
        // 사용자 블록체인 정보
        await axios.get('http://localhost:3000/userInfo/selectAddrAmountUsingAddr',{params: req.query}, null)  
        .then(async function (response) {
            userInfo.account_info = response.data.accountInfo
            
            // 사용자가 작성한 모든 글
            await axios.get('http://localhost:3000/userInfo/selectAllPost',{params: req.query}, null)  
            .then(async function (response) {
                userInfo.post_list = response.data.post_list
        
                console.log(userInfo)
                res.render('profile.ejs',{userInfo: userInfo})
                return ;
            })
            .catch(function (err) {
                console.log(err)
                return {"code" : 500, "msg" : "사용자가 작성한 글리스트 조회 실패", "error" : "" + err};
            });
            return ;
        })
        .catch(function (err) {
            console.log(err)
            return {"code" : 500, "msg" : "사용자 블록체인 정보 조회 실패", "error" : "" + err};
        });
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "사용자 정보 조회 실패", "error" : "" + err};
    });
});

/*  분석글 조회
    조회 데이터: 1) 분석글 리스트 */
router.get('/community', function (req, res, next) {
    // query: {search_page: 조회할 페이지 번호}
    return axios.get('http://localhost:3000/analysis/selectAnalysisPostList',{params: req.query}, null)  
    .then(function (response) {
        console.log(response.data.analysis_post_list);
        res.render('community.ejs',{postList: response.data.analysis_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

router.get('/create_1', function (req, res, next) {
    res.render('create_1.ejs')
});

router.get('/create_2', function (req, res, next) {
    week = new Date().getWeek();

    res.render('create_2.ejs', {week: week})
});

router.get('/create_3', function (req, res, next) {
    res.render('create_3.ejs')
});

router.get('/create_category', function (req, res, next) {
    res.render('create_category.ejs')
});

/*  주가예측글 상세 조회
    조회 데이터: 1) 분석글 정보, 투표자 리스트, 댓글정보 */
router.get('/post_1', function (req, res, next) {
    // query: {post_no: 조회할 게시글 번호}
    // post_type: '0'
    req.query.post_type = '0'
    
    return axios.get('http://localhost:3000/forecast/selectForecastPostDetail',{params: req.query}, null)  
    .then(function (response) {
        const postInfo = {post_info: response.data.forecast_post_info, voter_list: response.data.voter_list, comment_list: response.data.comment_list}
        console.log(postInfo)
        res.render('post_1.ejs',{postInfo: postInfo})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

/*  커뮤니티 운영글 상세 조회
    조회 데이터: 1) 커뮤니티 운영글정보, 투표자 리스트, 댓글정보 */
router.get('/post_2', function (req, res, next) {
    // query: {post_no: 조회할 게시글 번호}
    // post_type: '1'
    req.query.post_type = '1'
    
    return axios.get('http://localhost:3000/communicationOperation/selectCommunityOperationPostDetail',{params: req.query}, null)  
    .then(function (response) {
        const postInfo = {post_info: response.data.community_operation_post_info, voter_list: response.data.voter_list, comment_list: response.data.comment_list}
        console.log(postInfo)
        res.render('post_2.ejs',{postInfo: postInfo})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

/*  분석글 상세 조회
    조회 데이터: 1) 분석글정보, 투표자 리스트, 댓글정보 */
router.get('/post_3', function (req, res, next) {
    // query: {post_no: 조회할 게시글 번호}
    // post_type: '0'
    req.query.post_type = '2'
    
    return axios.get('http://localhost:3000/analysis/selectAnalysisPostDetail',{params: req.query}, null)  
    .then(function (response) {
        const postInfo = {post_info: response.data.analysis_post_info, voter_list: response.data.voter_list, comment_list: response.data.comment_list}
        console.log(postInfo)
        res.render('post_3.ejs',{postInfo: postInfo})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});

// 삭제
router.get('/settings', function (req, res, next) {
    res.render('settings.ejs')
});

// 삭제
router.get('/history', function (req, res, next) {
    res.render('history.ejs')
});

// 삭제
router.get('/info', function (req, res, next) {
    res.render('info.ejs')
});

router.get('/vote', function (req, res, next) {
    res.render('vote.ejs')
});

/*  투표중인 커뮤니티 커뮤니티 운영글 조회
    조회 데이터: 1) 커뮤니티 운영글 리스트 */
router.get('/vote_dao_active', function (req, res, next) {
    // query: {search_page: 조회할 페이지 번호}
    // 투표여부: y
    req.query.is_voting_yn = 'y'
    
    return axios.get('http://localhost:3000/communicationOperation/selectCommunityOperationPostList',{params: req.query}, null)  
    .then(function (response) {
        console.log(response.data.community_operation_post_list);
        res.render('vote_dao_active.ejs',{postList: response.data.community_operation_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});


/*  투표 완료된 커뮤니티 커뮤니티 운영글 조회
    조회 데이터: 1) 커뮤니티 운영글 리스트 */
router.get('/vote_dao_close', function (req, res, next) {
    // query: {search_page: 조회할 페이지 번호}
    // 투표여부: n
    req.query.is_voting_yn = 'n'
    
    console.log(req.query);

    return axios.get('http://localhost:3000/communicationOperation/selectCommunityOperationPostList',{params: req.query}, null)  
    .then(function (response) {
        console.log(response.data.community_operation_post_list);
        res.render('vote_dao_active.ejs',{postList: response.data.community_operation_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});


/*  투표중인 주가예측글 조회
    조회 데이터: 1) 주가예측글 리스트 */
router.get('/vote_stock_active', function (req, res, next) {
    // query: {search_page: 조회할 페이지 번호}
    // 투표여부: y
    req.query.is_voting_yn = 'y'
    
    return axios.get('http://localhost:3000/forecast/selectForecastPostList',{params: req.query}, null)  
    .then(function (response) {
        console.log(response.data.forecast_post_list);
        res.render('vote_stock_active.ejs',{postList: response.data.forecast_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});


/*  투표 완료된 주가예측글 조회
    조회 데이터: 1) 주가예측글 리스트 */
router.get('/vote_stock_close', function (req, res, next) {
    // query: {search_page: 조회할 페이지 번호}
    // 투표여부: y
    req.query.is_voting_yn = 'n'
    
    return axios.get('http://localhost:3000/forecast/selectForecastPostList',{params: req.query}, null)  
    .then(function (response) {
        console.log(response.data.forecast_post_list);
        res.render('vote_stock_active.ejs',{postList: response.data.forecast_post_list})
        return ;
    })
    .catch(function (err) {
        console.log(err)
        return {"code" : 500, "msg" : "실패", "error" : "" + err};
    });
});


module.exports = router;
