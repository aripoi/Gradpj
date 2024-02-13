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
    manage : function(request, response) {
        db.query(`SELECT * FROM COCKTAIL ORDER BY C_ID DESC`,
                function(err, result) {
                    if(err) {
                        throw err;
                    }
                    tmplogin = 'Y';
                    var context = {doc: `./cocktail/manage.ejs`,
                        loggined: tmplogin,
                        cls: request.session.login_id,
                        tag : 'C',
                        results: result};
                        request.app.render('index', context, function(err2, html){
                            if(err2) {
                                throw error;
                            }
                            response.end(html);
                        });
                });
    },
    ranking : function(request, response) {
        // top 10
        db.query(`SELECT * FROM COCKTAIL ORDER BY C_COUNT DESC LIMIT 10`, function(error, result) {
            if(error) {
                throw error;
            }
            else {
                var context = {
                    doc : `./cocktail/ranking.ejs`,
                    results : result,
                    tag : 'C',
                };
                request.app.render('index', context, function(err, html) {
                    if(err) {
                        throw err;
                    }
                    response.end(html);
                })
                }
            }
        )
    },
    addition : function(request, response) {
        var context = {
            doc : `./cocktail/addition.ejs`,
            loggined : 'Y',
            cls : request.session.login_id,
            tag : 'C',
            results : [0, 0, 0, 0, 0]
        };
        request.app.render('index', context, function(error, html) {
            if(error) {
                throw error;
            }
            response.end(html);
        })
    },
    addition_process : function(request, response) {
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var ct = qs.parse(body);
        urlencodedParser(request, response, function() {
            var ct = request.body;
            console.log(request.session.login_id);
            db.query(`INSERT INTO COCKTAIL(C_NAME, C_ING1, C_VOLUME1, C_ING2, C_VOLUME2, C_ING3, C_VOLUME3, C_ING4, C_VOLUME4, C_WRITER)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
                    [ct.cname, ct.cing1, ct.cvol1, ct.cing2, ct.cvol2, ct.cing3, ct.cvol3, ct.cing4, ct.cvol4], function(error, result) {
                        if(error) {
                            throw error;
                        }
                        else {
                            logger.info(`${request.session.login_id} 칵테일 레시피 - ${ct.cname} 추가`);
                            response.writeHead(302, {Location: `/cocktail/manage`});
                            response.end();
                        }

                    })
        })
    },
    update : function(request, response) {
        var ctId = request.params.ctId;
        db.query(`SELECT * FROM COCKTAIL WHERE C_ID = ${ctId}`,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {
                    cnum : result[0].C_ID,
                    cname : result[0].C_NAME,
                    cing1 : result[0].C_ING1,
                    cvol1 : result[0].C_VOLUME1,
                    cing2 : result[0].C_ING2,
                    cvol2 : result[0].C_VOLUME2,
                    cing3 : result[0].C_ING3,
                    cvol3 : result[0].C_VOLUME3,
                    cing4 : result[0].C_ING4,
                    cvol4 : result[0].C_VOLUME4,
                    cimg : result[0].C_IMG,
                    doc: `./cocktail/update.ejs`,
                    cId: ctId,
                    loggined: 'Y',
                    tag : 'C',
                    cls: request.session.login_id,
                    results : [0, 0, 0, 0, 0]
                };
                request.app.render('index', context, function(err, html){
                    if(err) {
                        throw error;
                    }
                response.end(html);
                });
            });
    },
    update_process : function(request, response) {
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var ct = qs.parse(body);
        //     var ctId = request.params.ctId;
        urlencodedParser(request, response, function() {
            var ct = request.body;
            var ctId = request.params.ctId;
            db.query(`SELECT * FROM COCKTAIL WHERE C_ID=?`, [ctId], function(err1, results1) {
                if(err1) {
                    throw err2;
                }
                else {
                    request.session.cname = results1[0].C_NAME;
                    db.query('UPDATE COCKTAIL SET C_NAME=?, C_ING1 = ?, C_VOLUME1=?, C_ING2=?, C_VOLUME2=?, C_ING3=?, C_VOLUME3=?, C_ING4=?, C_VOLUME4=? WHERE C_ID=?',
                    [ct.cname, ct.cing1, ct.cvol1, ct.cing2, ct.cvol2, ct.cing3, ct.cvol3, ct.cing4, ct.cvol4, ctId], function(error, result) {
                        if(error) {
                            throw error;
                        }
                        else {
                            logger.info(`${request.session.login_id} 칵테일 레시피 - ${request.session.cname} 변경`);
                            response.writeHead(302, {Location: encodeURI(`/cocktail/manage`)});
                            response.end();
                        }
    
                });
                }
            });

        });
    },
    delete_process : function(request, response) {
        var ctId = request.params.ctId;
        db.query(`SELECT * FROM COCKTAIL WHERE C_ID=?`, [ctId], function(err, results) {
            if(err) {
                throw err;
            }
            else {
                request.session.cname = results[0].C_NAME;
                db.query('DELETE FROM COCKTAIL WHERE C_ID=?', [ctId], function(error, result){
                    if(error) {
                        throw error;
                    }
                    else {
                        logger.info(`${request.session.login_id} 칵테일 레시피 - ${request.session.cname} 삭제`);
                        response.writeHead(302, {Location: encodeURI(`/cocktail/manage`)});
                        response.end();
                    }
        
                });
            }

        })

    }
}