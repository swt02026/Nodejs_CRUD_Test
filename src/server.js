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

function show(db, res, jadeTemplate) {
    
    db.query('select * from work');
    var html = jadeTemplate({
        show:"show"
    });
    writeHtml(res,html);
}

function showNothing(res, jadeTemplate) {
        
    var html = jadeTemplate({
        user:"UCCU",
        nothing:"nothing"
    });
    writeHtml(res,html);
}

function writeHtml(res,html) {
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html); 
}

var server = http.createServer(function (req, res) {
    var jadeTemplate = jade.compileFile('./index.jade');
    switch (req.url) {
        case '/show':
            
            break;
    
        default:
            showNothing(res, jadeTemplate);
            break;
    }
    
});

server.listen(3000);