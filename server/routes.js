var express = require('express');
var router = express.Router();
import handleRender from './render';
import { currentUser } from './auth/auth.service'


module.exports = function(app) {

  //API
  app.use('/api/user', require('./api/user'));
  app.use('/auth', require('./auth'));

  //Serve the app
  app.get('/*', currentUser(), handleRender);

}