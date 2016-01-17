'use strict';

var trim = require('lodash/trim');
var urlJoin = require('url-join');

function readString(str) {
  return trim(str);
}

function readInt(str) {
  return parseInt(str, 10);
}

function readUrl(str) {
  if (/^https?:\/\//.test(str))
    return str;

  return urlJoin('http://community.linuxmint.com/', str);
}

module.exports = {
  readString: readString,
  readInt: readInt,
  readUrl: readUrl
};
