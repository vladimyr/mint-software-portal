'use strict';

var cheerio = require('cheerio');
var endsWith = require('lodash/endsWith');
var utils = require('./utils.js');
var readUrl = utils.readUrl;
var readString = utils.readString;
var readInt = utils.readInt;


function isDefaultAvatar(url) {
  return endsWith(url, 'default_avatar.jpg');
}

function getReviews($, $reviewRows, options) {
  options = options || {};
  options.offset = parseInt(options.offset, 10) || 0;
  options.size = parseInt(options.size, 10) || 10;

  var reviews = [];

  var start = options.offset + 1;
  var end = start + options.size;

  var $rows = $reviewRows.slice(start, end);

  $rows.each(function(i, el) {
    var $columns = $(this).find('td');
    var $creatorColumn = $columns.eq(1);

    var review = {
      created: readString($columns.eq(0).text()),
      creator: {
        name: readString($creatorColumn.text()),
        profile: readUrl($creatorColumn.find('a').last().attr('href'))
      },
      rating: readInt($columns.eq(2).text()),
      content: readString($columns.eq(3).html())
    };

    var avatar = readUrl($creatorColumn.find('img').attr('src'));
    if (!isDefaultAvatar(avatar))
      review.creator.avatar = avatar;

    reviews.push(review);
  });

  return reviews;
}

function parseReviews(html, options) {
  var $ = cheerio.load(html);
  var $postInner = $('.art-content .art-Post-inner');
  var $reviewRows = $postInner.find('.commentsTable tr');

  var reviews = getReviews($, $reviewRows, options);
  return reviews;
}

parseReviews.getReviews = getReviews;
module.exports = parseReviews;
