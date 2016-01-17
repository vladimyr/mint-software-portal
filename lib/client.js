'use strict';

var util = require('util');
var got = require('got');
var urlJoin = require('url-join');
var parsePackageListing = require('./parser/parsePackageListing.js');
var parsePackageInfo = require('./parser/parsePackageInfo.js');
var parseReviews = require('./parser/parseReviews.js');


var baseUrl = 'http://community.linuxmint.com/software';

function getSearchSuggestions(query) {
  var url = urlJoin(baseUrl, '/search');
  var data = {
    search_software_name: query,
    search: 'Search'
  };

  return got.post(url, { body: data })
    .then(function complete(resp) {
      return {
        success: true,
        suggestions: parsePackageListing(resp.body)
      };
    });
}

function getPackages(options) {
  options = options || {};

  var page = Math.max(1, options.page);
  var offset = (page - 1) * 20;

  var url = urlJoin(baseUrl, '/search/', offset);

  return got(url)
    .then(function complete(resp) {
      return {
        success: true,
        packages: parsePackageListing(resp.body, options)
      };
    });
}

function searchPackages(options) {
  options = options || {};

  var url = urlJoin(baseUrl, '/search');
  var data = {
    search_software_name: options.query,
    search: 'Search'
  };

  return got.post(url, { body: data })
    .then(function complete(resp) {
      return {
        success: true,
        packages: parsePackageListing(resp.body)
      };
    });
}

function getPackageInfo(name, options) {
  options = options || {};
  var url = urlJoin(baseUrl, '/view/', name);

  return got(url)
    .then(function complete(resp) {
      if (!resp.body || resp.body.length === 0) {
        return {
          success: false,
          error: util.format('Package %s is not found!', name),
        };
      }

      return {
        success: true,
        package: parsePackageInfo(resp.body, options)
      };
    });
}

function getPackageReviews(name, options) {
  options = options || {};
  var url = urlJoin(baseUrl, '/view/', name);

  return got(url)
    .then(function complete(resp) {
      if (!resp.body || resp.body.length === 0) {
        return {
          success: false,
          error: util.format('Package %s is not found!', name),
        };
      }

      return {
        success: true,
        reviews: parseReviews(resp.body, options)
      };
    });
}

module.exports = {
  getSearchSuggestions: getSearchSuggestions,
  getPackages: getPackages,
  searchPackages: searchPackages,
  getPackageInfo: getPackageInfo,
  getPackageReviews: getPackageReviews
};
