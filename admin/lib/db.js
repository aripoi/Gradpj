var mysql = require('mysql');
var db = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'dbid232',
    password : 'dbpass232',
    database : 'db23205'
});
db.connect();
module.exports = db;