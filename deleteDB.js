const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

con.connect(function(err) {
    if(err) throw err;
    con.query("DELETE DATABASE user", function (err, result) {
        if (err) throw err;
        console.log("Database deleted");
        con.end()
    });
});