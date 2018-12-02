var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger.js');
var cors = require('cors')

module.exports = function(){
  var app = express();
    app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
  }));

  app.set('secret', 'your secret phrase here');

var whitelist = ['https://traceview-angular.azurewebsites.net', 'http://localhost:4200']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  exposedHeaders: ['x-access-token']
} 

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  app.use(expressValidator());

  app.use((req, res, next) => {
    const token = req.headers['x-access-token'];
    console.log('####################################');
    if(token) {
        console.log('A token is send by the application');
        console.log('Token value is ' + token);
    } else {
        console.log('No token is send by the the application');
    }
    console.log('####################################');
    next();
});

  consign()
   .include('controllers')
   .then('persistencia')
   .then('servicos')
   .into(app);

  return app;
}
