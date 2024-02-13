var db = require('./db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { end } = require('./db');
const bodyParser = require('body-parser');
const process = require('process');
const logger = require('../../../logger_admin')
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
    errorstat : function(request, response) {
        var titleofpage = 'log';
        db.query(`SELECT * FROM ERR`,
                function(err, result) {
                    if(err) {
                        throw err;
                    }
                    var context = {doc: `./management/errlog.ejs`,
                        results: result,
                        tag : 'D',};
                        request.app.render('index', context, function(err2, html){
                            if(err2) {
                                throw err2;
                            }
                            logger.info('관리자 로그 페이지 접속');
                            response.end(html);
                        });
                });
    },
    user : function(request, response) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM USER WHERE U_CHECK = 1 ORDER BY U_NUM DESC`,
                function(err, result) {
                    if(err) {
                        throw err;
                    }
                    tmplogin = 'Y';
                    var context = {doc: `./management/userlog.ejs`,
                        loggined: tmplogin,
                        cls: request.session.login_id,
                        results: result,
                        tag : 'D',};
                        request.app.render('index', context, function(err2, html){
                            if(err2) {
                                throw err2;
                            }
                            response.end(html);
                        });
                });
    },
    userDetail : function(request, response) {
        var uId = request.params.uId;
        var userId;
    
        // First query to get userId
        db.query(`SELECT * FROM USER WHERE U_NUM = '${uId}'`, function(error, results) {
            if (error) {
                console.error(error);
                return response.status(500).send("Internal Server Error");
            }
    
            // Check if a user was found
            if (results.length > 0) {
                userId = results[0].U_ID;
    
                // Second query using userId
                db.query(`SELECT * FROM LOG WHERE L_UID = '${userId}' ORDER BY L_ID DESC`, function(err, result) {
                    if (err) {
                        console.error(err);
                        return response.status(500).send("Internal Server Error");
                    }
    
                    var context = {
                        doc: `./management/userlogdetail.ejs`,
                        userId: userId,
                        results: result,
                        tag : 'D',
                    };
    
                    request.app.render('index', context, function(err2, html) {
                        if (err2) {
                            console.error(err2);
                            return response.status(500).send("Internal Server Error");
                        }
    
                        logger.info(`관리자 사용자 - ${userId} 로그 페이지 접속`);
                        response.end(html);
                    });
                });
            } else {
                // Handle case where no user is found with the given ID
                return response.status(404).send("User not found");
            }
        });
    },
    delete : function(request, response) {
        var lId = request.params.lId;
        db.query('DELETE FROM LOG WHERE L_ID=?', [lId], function(error, result){
            if(error) {
                throw error;
            }
            logger.info(`관리자 로그번호 ${lId} 삭제`);
            response.writeHead(302, {Location: encodeURI(`/management/user`)});
            response.end();
        });
    }
}