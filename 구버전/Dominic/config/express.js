module.exports = function(){
    const express = require('express');
    const session = require('express-session');
    const MySQLStore = require('express-mysql-session')(session);
    const bodyParser = require('body-parser');

    const app = express();
      app.set('views', './views/mysql');
      app.set('view engine', 'jade');
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(session({
            secret: '1234DSFs@adf1234!@#$asd',
            resave: false,
            saveUninitialized: true,
            store:new MySQLStore({
              host:'localhost',
              port:3306,
              user:'root',
              password:'111111',
              database:'board'
        })
      }));
      return app;
    };