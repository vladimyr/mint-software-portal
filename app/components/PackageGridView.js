'use strict';

var Vue = require('vue');
var api = require('../lib/api.js');
var template = require('./packageGrid.html');


function groupPackages(packages) {
  var table = [];
  var row = [];

  packages.forEach(function(pkg, i) {
    if (i % 3 === 0 && i > 0) {
      table.push(row);
      row = [];
    }

    row.push(pkg);
  });

  if (row.length !== 0)
    table.push(row);

  return table;
}

var PackageGridView = Vue.extend({
  template: template,
  name: 'PackageGridView',
  data: function() {
    return {
      packages: [],
      packageTable: [],
      action: 'browse',
      query: '',
      page: 1
    };
  },
  route: {
    data: function(transition) {
      var dest = transition.to;

      this.action = dest.name;
      this.query = dest.query.q;
      this.page = parseInt(dest.query.page || 1, 10);

      this.getPackages();
    }
  },
  methods: {
    getPackages: function() {
      var self = this;

      api.getPackages(this.action, this.page, this.query)
        .then(groupPackages)
        .then(function complete(table) {
          self.packageTable = table;
        });
    }
  }
});

module.exports = PackageGridView;
