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
    });
    var sql = "CREATE TABLE `user`.`image` ( `img_id` INT NOT NULL AUTO_INCREMENT, `image` VARCHAR(50) NOT NULL, `uid` INT NOT NULL, PRIMARY KEY (`img_id`), FOREIGN KEY (`uid`) REFERENCES `user`.`user_detail`(`uid`));"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    var sql = "CREATE TABLE `user`.`comments` ( `cid` INT NOT NULL AUTO_INCREMENT, `comment` VARCHAR(50) NOT NULL, `uid` INT NOT NULL, `img_id` INT NOT NULL, PRIMARY KEY (`cid`), FOREIGN KEY (`uid`) REFERENCES `user`.`user_detail`(`uid`), FOREIGN KEY (`img_id`) REFERENCES `user`.`image`(`img_id`));"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    var sql = "CREATE TABLE `user`.`connection` ( `start_UID` INT NOT NULL, `end_UID` INT NOT NULL, PRIMARY KEY (`start_UID`, `end_UID`));"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    var sql = "CREATE TABLE `user`.`likes` ( `UID` INT NOT NULL, `img_ID` INT NOT NULL, PRIMARY KEY (`UID`, `img_ID`));"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        con.end();
    });
});