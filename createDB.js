const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

con.connect(function(err) {
    if(err) throw err;
    con.query("CREATE DATABASE user", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    var sql = "CREATE TABLE `user`.`user_detail` ( `uid` INT(11) NOT NULL AUTO_INCREMENT , `email` VARCHAR(100) NOT NULL , `u_name` VARCHAR(50) NOT NULL , `phone` VARCHAR(10) NOT NULL , `password` VARCHAR(100) NOT NULL , `img` VARCHAR(50) NULL DEFAULT NULL , PRIMARY KEY (`uid`), UNIQUE (`email`)) ENGINE = InnoDB";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        con.end();
    });
});