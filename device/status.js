const db = require('./lib/db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { error } = require('console');
const express = require('express');
const bodyParser = require('body-parser');

const deviceStatus = {};

module.exports = {
    devstat: function (request, response) {
        const { id } = request.body;
        console.log(id);
        db.query(`SELECT * FROM USER WHERE U_ID = '${id}'`, function (err, result) {
            if (err) {
                throw err;
            }
            const devstatus = deviceStatus[result[0].U_MID];
            console.log(devstatus);
            response.send({ success: true, devstatus });
        })
    },
    sendstat: function (request, response) {
        const { serial_number, status } = request.body;
        db.query('UPDATE MACHINE SET M_STATUS = ? WHERE M_ID = ?', [status, serial_number], function (err, result) {
            if (err) {
                throw err;
            }
            console.log(serial_number, status);
            deviceStatus[serial_number] = status;
            response.send('Got Status Successfully.');
        });
    },
    showstat: function (request, response) {
        console.log(deviceStatus);

        db.query(`SELECT MACHINE.M_ID, MACHINE.M_DATE, MACHINE.M_IP, MACHINE.M_STATUS, USER.U_ID, USER.U_NICKNAME 
                    FROM MACHINE JOIN USER ON MACHINE.M_ID = USER.U_MID`, function(err, result) {
            if (err) {
                console.error(err);
            }
            var context = {
                tag: 'D',
                doc: `./management/devicelog.ejs`,
                results: result,
            };
            request.app.render('index', context, function (err, html) {
                if (err) {
                    throw error;
                }
                response.end(html);
            })
        })
        // logger.info('관리자 사용자 기기 등록 현황 조회');

    }
}