var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var jade = require('jade');
var qs = require('querystring');
var url = require('url');


var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test2'
});

function show(db, res, jadeTemplate) {
    
    db.query('select * from work',function (err, rows) {

        var html = jadeTemplate({
            show:"show",
            rows:rows
        });
        writeHtml(res,html);
    });
}

function show_delete(db, res, jadeTemplate) {
    
    db.query('select * from work',function (err, rows) {

        var html = jadeTemplate({
            delete_db: "delete",
            rows:rows
        });
        writeHtml(res,html);
    });
}

function show_insert(res, jadeTemplate) {
    
    var html = jadeTemplate({
        insert: "insert"
    });
    writeHtml(res, html);
}

function show_update(db, res, jadeTemplate) {
    
    db.query('select * from work',function (err, rows) {

        var html = jadeTemplate({
            update: "update",
            rows:rows
        });
        writeHtml(res,html);
    });
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

function delete_item(db, req) {
    
  var data = "";
  req.on('data',function(chunk){
    data += chunk;
  });
  req.on('end', function(){
  
    var post = qs.parse(data);
    
    db.query(
        'Delete From work where id in (' + 
        post['wantToDelete'].join(',') + ')'
        );
  });
}

function insert_item(db, req) {
    
    var data = "";
    req.on('data',function(chunk){
        data += chunk;
    });
    req.on('end', function(){

        var post = qs.parse(data);
        db.query(
            'insert into work(name) values (?)',
            [post.name]
            );
    });
}

function update_item(db, req) {
    
    var data = "";
    req.on('data',function(chunk){
        data += chunk;
    });
    req.on('end', function(){

        var post = qs.parse(data);
        console.log(post);
    });
}

function redirectTpoShow(res) {
    res.writeHead(302,{
        'Location':'/show'
    });
    res.end();
}

var server = http.createServer(function (req, res) {
    
    var jadeTemplate = jade.compileFile('./index.jade');
    switch (req.method) {
        
        case 'GET':
        
            switch (req.url) {
                case '/show':
                    show(db, res, jadeTemplate);
                    break;
                case '/delete':
                    show_delete(db, res, jadeTemplate);
                    break;
                case '/insert':
                    show_insert(res, jadeTemplate);
                    break;
                case '/update':
                    show_update(db, res, jadeTemplate);
                    break;
                default:
                    showNothing(res, jadeTemplate);
                    break;
            }
            break;
            
        case 'POST':
        
            switch (req.url) {
                case '/delete':
                    delete_item(db, req);
                    break;
                case '/insert':
                    insert_item(db, req);
                    break;
                case '/update':
                    update_item(db, req);
                    break;
            }
            redirectTpoShow(res);
            break;
            
        default:
            showNothing(res, jadeTemplate);
            break;
    }

    
});

server.listen(3000);
