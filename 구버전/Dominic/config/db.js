module.exports = function() {
    var mysql = require('mysql');

// 로컬에서 실험하고자함
    /*var connection = mysql.createConnection({
        host: '10.0.0.1',
        user: 'rjsrb365',
        port : '3306',
        password: 'password',
        database: 'rjsrb365'
    });
    */
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '111111',
        database: 'board',
        port : '3306'
    });
    connection.connect();
    return connection;
};