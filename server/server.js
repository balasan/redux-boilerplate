/* eslint-disable no-console, no-use-before-define */
import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import qs from 'qs'; //why we need this?
import handleRender from './render';
import socketServer from './socket';
var router = Express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');

const app = new Express();

require('dotenv').config({silent: true});

//-------------Dev server watch and hot reload---------------
var isDevelopment = (process.env.NODE_ENV !== 'production');
if (isDevelopment) {
  console.log('Launching hot dev environment');
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackConfig = require('../webpack.config');
  // Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(favicon(__dirname + '/../public/img/favicon.ico'));

//Connect to db
require('./config/db.connect');
if (process.env.SEED_DB) {
  require('./config/seed');
}

// Persist sessions with mongoStore
// We need to enable sessions for passport twitter because its an oauth 1.0 strategy
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
  db: new mongoStore({
    db: mongoose.connection.db,
    autoRemove: 'interval',
    autoRemoveInterval: 10, // In minutes. Default
    touchAfter: 24 * 3600, // time period in seconds
    clear_interval: 3600
  })
}));

//public folder
app.use(Express.static(__dirname + '/../public'));

var routes = require('./routes')(app);

var port = process.env.PORT || 3000;

var server = app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

socketServer(server);

exports = module.exports = app;
