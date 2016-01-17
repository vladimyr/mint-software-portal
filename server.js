'use strict';

var debug = require('debug')('api');
var express = require('express');
var cors = require('cors');
var helmet = require('helmet');
var client = require('./lib/client.js');
var join = require('path').join;

var app = express();

var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';

var app = express();
app.set('port', port);
app.set('ip', ip);

app.use(helmet());
app.use(cors());

app.use('/', express.static(join(__dirname, '/dist')));

app.get('/browse', function(req, res, next) {
  client.getPackages({ page: req.query.page })
    .then(res.json.bind(res));
});

app.get('/search', function(req, res, next) {
  var query = req.query.q || req.query.query;
  client.searchPackages({ page: req.query.page, query: query })
    .then(res.json.bind(res));
});

app.get('/package/:name', function(req, res, next) {
  client.getPackageInfo(req.params.name, { reviews: req.query.reviews })
    .then(res.json.bind(res));
});

app.get('/package/:name/reviews', function(req, res, next) {
  client.getPackageReviews(req.params.name, { reviews: req.query.size, offset: req.query.offset })
    .then(res.json.bind(res));
});

app.get('/search/suggestions', function(req, res, next) {
  var query = req.query.q || req.query.query;
  client.getSearchSuggestions(query)
    .then(res.json.bind(res));
});


function onListen() {
  console.log('Server is listening at http://%s:%d', ip, port);
}

var server = app.listen(app.get('port'), app.get('ip'), onListen);
