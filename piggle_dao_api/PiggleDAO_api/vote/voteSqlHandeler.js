const connectionPool = require('../db/connectionPool');

// 설정파일
const fs = require('fs');
const path = require('path');
const jsonFile = fs.readFileSync(path.resolve(__dirname, "../smartcontract/config.json"));
const configJson = JSON.parse(jsonFile);

const converter = require('xml-js');

// query 파일
const voteSql = fs.readFileSync(path.resolve(__dirname, "./voteSql.xml"), 'utf-8');

// xml to json
let voteSqlToJson = JSON.parse(converter.xml2json(voteSql, {compact: true, spaces: 4}));

// 투표정보 저장
const insertVoteInfo = function (datas){
    return new Promise(async(resolve, reject)=>{
        try {
            const queryStr = voteSqlToJson.query.insertVoteInfo._text;

            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, [datas], (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "투표 정보 저장 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();
                                    
                            console.log("저장 완료");
                            return resolve({"code":200, "msg" : "투표 정보 저장 완료"})
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "insertVoteInfo 에러", "error": "" + err});
        }
    });
}

// 특정 app_id에 투표한 사람들 조회
const selectVoterList = function (datas){
    return new Promise(async(resolve, reject)=>{
        try {
            let queryStr
            // app_id만 넘어온 경우
            if(datas.length == 1){
                queryStr = voteSqlToJson.query.selectVoterList._text;
            } else {
                // 인원수 제한해서 조회하는 경우
                queryStr = voteSqlToJson.query.selectVoterList._text + '\n' + voteSqlToJson.query.paging._text;
            }

            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, datas, async (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "db에 데이터 저장 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();

                            if(rows.length != 0){
                                return resolve({"code":200, "msg" : "투표인원 조회 완료", "voter_list": rows})
                            } else {
                                return resolve({"code":500, "msg" : "투표인원 조회 실패", "voter_list": null})
                            }
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "selectVoterList 에러", "error": "" + err});
        }
    });
}

// 특정 사용자가 특정 app에 투표했는지 여부 확인
const selectIsVoting = function (datas){
    return new Promise(async(resolve, reject)=>{
        try {
            let queryStr = voteSqlToJson.query.selectIsVoting._text;

            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, datas, async (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "투표여부 조회 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();

                            if(rows.length != 0){
                                return resolve({"code":200, "msg" : "투표여부 조회 완료", "is_voting": "true"})
                            } else {
                                return resolve({"code":200, "msg" : "투표여부 조회 완료", "is_voting": "false"})
                            }
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "selectUserInfo 에러", "error": "" + err});
        }
    });
}

// 특정일에 작성된 예측글들의 종목코드 조회
const selectStockCodeListByDate = function (queryStr, datas){
    return new Promise(async(resolve, reject)=>{
        try {
            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, datas, async (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "db에 데이터 저장 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();

                            if(rows.length != 0){
                                return resolve({"code":200, "msg" : "예측글 종목코드 조회 완료", "stock_code_list": rows})
                            } else {
                                return resolve({"code":500, "msg" : "예측글 종목코드 조회 실패", "stock_code_list": null})
                            }
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "selectUserInfo 에러", "error": "" + err});
        }
    });
}


// 사용자 프로필 수정
const updateUserProfile = function (queryStr, datas){
    return new Promise(async(resolve, reject)=>{
        try {
            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, datas, async (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "db에 데이터 저장 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();

                            return resolve({"code":200, "msg" : "수정 완료", "cid" : datas[0]})
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "updateUserProfile 에러", "error": "" + err});
        }
    });
}

// 사용자 정보 삭제
const deleteUserInfo = function (queryStr, datas){
    return new Promise(async(resolve, reject)=>{
        try {
            // db pool 가져오기
            const dbPool = await connectionPool.getPool();

            console.log(datas);
                    
            // db pool에서 연결객체를 가져오기
            dbPool.getConnection(async (err, conn) => {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                    console.log("커넥션 에러\n" + err);
                    return resolve({"code":500, "msg" : "db 커넥션 연결 중 에러", "error": "" + err});
                } else {
                    // 내부 콜백에서 쿼리를 수행
                    await conn.query(queryStr, datas, async (err, rows, fields) => {
                        if (err) {
                            if (conn) {
                                conn.release();
                            }
                            console.log(err)
                            return resolve({"code":500, "msg" : "db에 데이터 저장 중 에러", "error": "" + err});
                        } else {
                            // 커넥션 반납
                            conn.release();

                            return resolve({"code":200, "msg" : "사용자 정보 삭제 완료"})
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
            return resolve({"code":500, "msg" : "deleteUserInfo 에러", "error": "" + err});
        }
    });
}

module.exports={
    insertVoteInfo,
    selectVoterList,
    selectStockCodeListByDate, 
    updateUserProfile,
    deleteUserInfo,
    selectIsVoting
}