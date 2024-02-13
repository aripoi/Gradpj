const db = require('./lib/db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { error } = require('console');
const express = require('express');
const bodyParser = require('body-parser');

const raspberryPiDict = {};


module.exports = {
    user : function(request, response) {
        const { id } = request.body;

        db.query(`SELECT * FROM USER WHERE U_ID = '${id}'`, function(err, result) {
            if(err) {
                throw err;
                 response.status(500).send({ success : false, message : 'ad'});
            }
            const raspberryPiIp = raspberryPiDict[result[0].U_MID] || "unknown";
            response.send({ success : true, raspberryPiIp });
        })
    },
    device: function(request, response) {
        const { serial_number, ip_address } = request.body;
        db.query('UPDATE MACHINE SET M_IP = ? WHERE M_ID = ?', [ip_address, serial_number], function(err, result) {
            if(err) {
                throw err;
            }
            console.log(serial_number, ip_address);
            raspberryPiDict[serial_number] = ip_address;
            console.log(raspberryPiDict[serial_number]);
            response.send("Dictionary adds successfully.");
        });
    }
}