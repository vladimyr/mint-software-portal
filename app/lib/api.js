'use strict';

var Vue = require('vue');
var urlJoin = require('url-join');
var Promise = require('pinkie-promise');

var baseUrl = '/';

function getPackageInfo(name) {
  var url = urlJoin(baseUrl, '/package', name);
  var options = { params: { reviews: 10 }};

  return Vue.http.get(url, null, options)
    .then(function complete(resp) {
      return resp.data.package;
    });
}

function getSearchSuggestions(query) {
  var url = urlJoin(baseUrl, '/search/suggestions');
  var options = { params: { q: query }};

  if (!query)
    return Promise.resolve([]);

  return Vue.http.get(url, null, options)
    .then(function(resp) {
      return resp.data.suggestions;
    });
}

function getPackages(action, page, query) {
  page = page || 1;

  var url = urlJoin(baseUrl, action);
  var options = { params: { page: page, q: query }};

  return Vue.http.get(url, null, options)
    .then(function(resp) {
      return resp.data.packages;
    });
}

module.exports = {
  getPackages: getPackages,
  getPackageInfo: getPackageInfo,
  getSearchSuggestions: getSearchSuggestions
};
