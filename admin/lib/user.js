var db = require('./db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { error } = require('console');
const bodyParser = require('body-parser');
const logger = require('../../../logger_admin');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

var d = new Date();
var year = d.getFullYear();
var month = ('0' + (d.getMonth() + 1)).slice(-2);
var day = ('0' + d.getDate()).slice(-2);

var dateString = year + '-' + month  + '-' + day;


var t = new Date();
var hours = ('0' + t.getHours()).slice(-2); 
var minutes = ('0' + t.getMinutes()).slice(-2);
var seconds = ('0' + t.getSeconds()).slice(-2); 

var timeString = hours + ':' + minutes  + ':' + seconds;

module.exports = {
    userList : function(request, response) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM USER WHERE U_CHECK = 1 ORDER BY U_NUM DESC`,
                function(err, result) {
                    if(err) {
                        throw err;
                    }
                    tmplogin = 'Y';
                    var context = {doc: `./user/userList.ejs`,
                        results: result,
                        tag : 'U'};
                        request.app.render('index', context, function(err2, html){
                            if(err2) {
                                throw error;
                            }
                            logger.info('관리자 사용자 관리 페이지 접속');
                            response.end(html);
                        });
                });
    }, userListBan : function(request, response) {
        var titleofcreate = 'check';
        db.query(`SELECT * FROM USER WHERE U_CHECK = 0 ORDER BY U_NUM DESC`,
                function(err, result) {

                    if(err) {
                        throw err;
                    }
                    tmplogin = 'Y';
                    var context = {doc: `./user/userListBan.ejs`,
                        loggined: tmplogin,
                        cls: request.session.login_id,
                        results: result,
                        tag : 'U'};
                        request.app.render('index', context, function(err2, html){
                            if(err2) {
                                throw error;
                            }
                            logger.info('관리자 비활성 사용자 관리 페이지 접속');
                            response.end(html);
                        });
                });
    },
    userUpdate : function(request, response) {
        var titleofcreate = 'Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM USER WHERE U_NUM = ${planId}`,
            function(error, result) {
                request.session.unick = result[0].U_NICKNAME;
                if(error) {
                    throw error;
                }
                var context = {
                    banned : 'N',
                    doc: `./user/userCreate.ejs`,
                    unickname: result[0].U_NICKNAME,
                    uid: result[0].U_ID,
                    upassword: result[0].U_PASSWORD,
                    uphone: result[0].U_PHONE,
                    umid: result[0].U_MID,
                    uemail: result[0].U_EMAIL,
                    unum: result[0].U_NUM,
                    pId: planId,
                    loggined: 'Y',
                    results : [0, 0, 0, 0, 0],
                    tag : 'U',
                    cls: request.session.login_id
                };
                request.app.render('index', context, function(err, html){
                    if(err) {
                        throw error;
                    }
                response.end(html);
                });
            });
    }, userUpdateBan : function(request, response) {
        var titleofcreate = 'Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM USER WHERE U_NUM = ${planId}`,
            function(error, result) {
                request.session.unick = result[0].U_NICKNAME;
                request.session.uid = result[0].U_ID;
                if(error) {
                    throw error;
                }
                var context = {
                    banned : 'B',
                    doc: `./user/userCreate.ejs`,
                    unickname: result[0].U_NICKNAME,
                    uid: result[0].U_ID,
                    upassword: result[0].U_PASSWORD,
                    uphone: result[0].U_PHONE,
                    umid: result[0].U_MID,
                    uemail: result[0].U_EMAIL,
                    unum: result[0].U_NUM,
                    pId: planId,
                    loggined: 'Y',
                    tag : 'U',
                    results:[0, 0, 0, 0, 0],
                    cls: request.session.login_id
                };
                request.app.render('index', context, function(err, html){
                    if(err) {
                        throw error;
                    }
                response.end(html);
                });
            });
    },
    userUpdate_process : function(request, response) {
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var plan = qs.parse(body);
            var planId = request.params.planId;
                db.query('UPDATE USER SET U_CHECK = 1 WHERE U_NUM=?',
                [planId], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    console.log(request.session.unick);
                    logger.info(`관리자 사용자 - ${request.session.unick} 복구`);
                response.writeHead(302, {Location: encodeURI(`/user/list`)});
                response.end();
            });
    }, userDelete_process : function(request, response) {
        var planId = request.params.planId;
        db.query(`SELECT U_NICKNAME FROM USER WHERE U_NUM=?`, [planId], function(err, results) {
            console.log(results);
            if(err) {
                throw err;
            }
            request.session.unick = results[0].U_NICKNAME;
        })
        db.query('UPDATE USER SET U_CHECK = 0 WHERE U_NUM=?', [planId], function(error, result){
            if(error) {
                throw error;
            }
            logger.info(`관리자 사용자 - ${request.session.unick} 비활성화`);
            response.writeHead(302, {Location: encodeURI(`/user/list`)});
            response.end();
        });
    }, userDelete_processBan: function (request, response) {
        var planId = request.params.planId;
    
        // First query to retrieve user data
        db.query(`SELECT * FROM USER WHERE U_NUM=?`, [planId], function (err, results) {
            if (err) {
                console.error(err);
                return response.status(500).json({ success: false, message: 'Database error.' });
            }
    
            // Set session variables
            request.session.unick = results[0].U_NICKNAME;
            request.session.uid = results[0].U_ID;
    
            // Second query to delete from LOG table
            db.query(`DELETE FROM LOG WHERE L_UID = '${request.session.uid}'`, (err, results) => {
                if (err) {
                    console.error(err);
                    return response.status(500).json({ success: false, message: 'Database error.' });
                }
    
                // Third query to delete from USER table
                db.query('DELETE FROM USER WHERE U_NUM=?', [planId], function (error, result) {
                    if (error) {
                        console.error(error);
                        return response.status(500).json({ success: false, message: 'Database error.' });
                    }
                        // Log and redirect
                        logger.info(`관리자 사용자 - ${request.session.unick} 영구삭제`);
                        response.writeHead(302, { Location: encodeURI(`/user/list`) });
                        response.end();

                });
            });
        });
    }, device : function(request, response) {
        db.query(`SELECT * FROM USER WHERE U_MID IS NOT NULL`, function(err, result) {
            if(err) {
                console.error(err);
            }
            logger.info('관리자 사용자 기기 등록 현황 조회');
            var context = {
                doc: `./user/userdevice.ejs`,
                results : result,
            };
            request.app.render('index', context, function(err, html){
                if(err) {
                    throw error;
                }
            response.end(html);
            })
        })
    }, history : function(request, response) {
        db.query(`SELECT * FROM USELOG ORDER BY USE_DATE DESC`, function(err, result) {
            if(err) {
                throw err;
            }
            var context = {
                doc : `./user/history.ejs`,
                results : result,
                tag : 'U'
            };
            request.app.render('index', context, function(err, html) {
                if(err) {
                    throw err;
                }
            response.end(html);
            })
        }) 
    }
}