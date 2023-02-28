const path = require('path');
var logger = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
//const register = require('@react-ssr/express/register');
const cors = require('cors')
const bodyParser = require('body-parser');
//const ReactDOMServer = require('react-dom/server');
require('dotenv').config();
const routes = require('./server/routers/routes.js');
//const routes = require('./db1.js');
const nocache = require("nocache");
const {app, server} = require ("./server");

/*(async () => {
  await register(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
//var options = { beautify: true, doctype: "<!DOCTYPE html>" };
//app.engine('jsx', require('express-react-views').createEngine(options));*/

app.get('/favicon.ico', function(req, res, next) { 
  //res.sendStatus(204); 
  next();
});

const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true, optionSuccessStatus:200 }));
app.use(expressSession);
app.use(nocache());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
module.exports = app;
