'use strict';

var cheerio = require('cheerio');
var utils = require('./utils.js');

function parsePackageListing(html) {
  var $ = cheerio.load(html);
  var $packageRows = $('.art-article tr').slice(1);

  var packages = [];
  $packageRows.each(function(i, el) {
    var $this = $(this);

    var pkg = {
      score: utils.readInt($this.find('td > font').text()),
      name: $this.find('td a').text(),
      desc: $this.find('td > small > font').text()
    };

    packages.push(pkg);
  });

  return packages;
}

module.exports = parsePackageListing;
