var db = require('./db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { end } = require('./db');
const bodyParser = require('body-parser');
const process = require('process');
const logger = require('../../../logger_admin.js');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

function authIsOwner(request, response){
    if(request.session.is_logined){
        return true;
    } else {
        return false;
    }
}

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
    login : function(request, response){
        var subdoc;
        var context;
        var check_id;
        var check_password;
        db.query(`SELECT A_ID, A_PASSWORD FROM ADMIN`, function(err, result) {
            check_id = result[0].A_ID;
            check_password = result[0].A_PASSWORD;
            if(authIsOwner(request, response) === true){
                subdoc = `./main/main.ejs`;
                index = './main/main';
                context = {
                    doc : subdoc,
                    pw : request.session.id_password,
                    cls : request.session.login_id,
                    loggined : authIsOwner(request, response)};
            }
            else {
                subdoc = `./login/login.ejs`;
                index = './login/login';
                context = {
                    aid : check_id,
                    apw : check_password,
                    doc : subdoc,
                    pw : request.session.id_password,
                    cls : request.session.login_id,
                    loggined : authIsOwner(request, response)};
            }
            request.app.render(index, context, function(err, html){
                response.end(html);})
        })

    }, login_process : function(request, response) {
        // var body = '';
        // request.on('data', function(data){
        //     body = body + data;
        // });
        // request.on('end', function(){
            urlencodedParser(request, response, function() {
                var post = request.body;
            db.query(`SELECT A_ID, A_PASSWORD FROM ADMIN WHERE A_ID = ? and A_PASSWORD = ? `,
            [post.id, post.pw], function(error, result) {
                if(error) {
                    throw error;
                    }
                if( result[0] === undefined) {
                    logger.warn("admin 로그인 실패-계정정보 오류");
                    response.redirect(`/`);
                    // response.end('Who ?');
                }
                else
                {
                    request.session.is_logined = true;
                    request.session.login_id = result[0].A_ID;
                    request.session.id_password = result[0].A_PASSWORD;
                    logger.info(result[0].A_ID + " 접속");
                    response.redirect(`/main`);
                    //response.end('Welcome !!!');
                }
            }
        );
    })
    }, logout : function(request, response) {
        logger.info("admin 로그아웃");
        request.session.destroy(function(err){
            response.redirect('/');
        });
    }, changepw : function(request, response) {
        var uId = request.params.uId;
        db.query(`SELECT A_ID, A_PASSWORD FROM ADMIN WHERE A_ID = 'admin'`,
            function(error, result) {
                if(error) {
                    throw error;
                }
                index = './changepw/changepw';
                var context = {
                    doc : `./changepw/changepw.ejs`,
                    loginid: result[0].A_ID,
                    password: result[0].A_PASSWORD,
                    loggined: 'Y',
                    cls: request.session.login_id,
                };
                request.app.render(index, context, function(err, html){
                response.end(html);
                });
            });
    }, changepw_process : function(request, response) {
        // var body ='';
        // request.on('data', function(data){
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var cpw = qs.parse(body);
        urlencodedParser(request, response, function() {
            var cpw = request.body;
            db.query('UPDATE ADMIN SET A_PASSWORD=? WHERE A_ID =?',
                [cpw.password, request.session.login_id], function(err, result){
                    logger.info("admin 비밀번호 변경");
                    response.writeHead(302, {Location: encodeURI(`/user/list`)});
                    response.end();
                });
        });
    }, main : function(request, response) {
        var subdoc;
        var context;
            subdoc = `./main/main.ejs`;
            index = './main/main';
            context = {
                doc : subdoc,
                pw : request.session.id_password,
                cls : request.session.login_id,
                loggined : authIsOwner(request, response)};
        request.app.render(index, context, function(err, html){
        response.end(html);})
    }, download : function(request, response) {
        response.send('APK 다운로드 링크 : /Final_Final.apk');
    }
}
