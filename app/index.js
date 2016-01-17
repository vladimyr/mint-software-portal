'use strict';

var Vue = require('vue');
var Router = require('vue-router');
var PackageView = require('./components/PackageView.js');
var PackageGridView = require('./components/PackageGridView.js');
var SearchBox = require('./components/SearchBox.js');

Vue.use(Router);
Vue.use(require('vue-resource'));

var App = Vue.extend({});
var router = new Router();

router.map({
  '/browse': {
    name: 'browse',
    component: PackageGridView
  },
  '/search': {
    name: 'search',
    component: PackageGridView
  },
  '/package/:name': {
    name: 'package',
    component: PackageView
  }
});

router.redirect({
  '*': '/browse'
});

router.start(App, '#app');
