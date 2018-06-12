var express = require('express');
var path = require("path");
var app = express();
var auth = require('./routes/auth');
var project = require('./routes/project');
var fs = require('fs');

app.use('/project', project);
app.use('/auth', auth);

app.use('/', project);
app.use(express.static(path.join(__dirname, '/')));

// view engine setup
app.set('view engine', 'jade');
app.set('views', '/home/hosting_users/rjsrb365/apps/rjsrb365_dominic/views');

module.exports = app;

app.use('/script', express.static(__dirname + "/public/assets/js"));
app.use('/img', express.static(__dirname + "/public/img"));
app.use('/css', express.static(__dirname + "/public/assets/css"));
app.use('/font', express.static(__dirname + "/public/assets/font"));

app.listen(8001, function(){
    console.log('8001 포트에 연결되었습니다!');
});
/*
var app = require('./config/express')();
// var passport = require('./config/passport')(app);
// var auth = require('./routes/auth')(passport);
var auth = require('./routes/auth');
var express = require('express');
var path = require('path');
app.use('/auth/', auth);
var project = require('./routes/project');
app.use(project);
app.use('/', project);
app.use(express.static(path.join(__dirname, '/')));
app.listen(3000, function(){
    console.log('Connected 3000 port!!!');
}); */