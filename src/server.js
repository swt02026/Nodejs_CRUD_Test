var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var jade = require('jade');

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test2'
});

function show(db, res) {
    
    db.query('select * from work');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    var html;
    res.end(html); 
}

function showNothing(res) {
    
    var jadeTemplate = jade.compileFile('./index.jade');
    var html = jadeTemplate({
        user:"UCCU"
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    
    res.end(html); 
}

var server = http.createServer(function (req, res) {
    
    showNothing(res);
});

server.listen(3000);