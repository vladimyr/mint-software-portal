'use strict';

var cheerio = require('cheerio');
var getReviews = require('./parseReviews.js').getReviews;
var utils = require('./utils.js');
var readUrl = utils.readUrl;
var readString = utils.readString;
var readInt = utils.readInt;


function getScreenshots($, $section) {
  var screenshots = [];

  $section
    .find('a')
    .map(function(i, el) {
      var $this = $(this);
      screenshots.push({
        image: readUrl($this.attr('href')),
        thumbnail: readUrl($this.find('img').attr('src'))
      });
    });

  return screenshots;
}

function getCategories($, $section) {
  var categories = [];

  $section
    .find('a')
    .each(function(i, el) {
      var $this = $(this);
      categories.push({
        name: readString($this.text()),
        link: readUrl($this.attr('href'))
      });
    });

  return categories;
}

function getReleases($, $section) {
  var releases = [];

  $section
    .find('a')
    .each(function(i, el) {
      var $this = $(this);
      releases.push({
        name: readString($this.text()),
        link: readUrl($this.attr('href'))
      });
    });

  return releases;
}

function getReviews($, $reviewRows) {
  var reviews = [];

  $reviewRows.each(function(i, el) {
    var $columns = $(this).find('td');

    var review = {
      created: readString($columns.eq(0).text()),
      creator: readString($columns.eq(1).text()),
      rating: readInt($columns.eq(2).text()),
      content: readString($columns.eq(3).text())
    };

    reviews.push(review);
  });

  return reviews;
}

function parsePackageInfo(html, options) {
  options = options || {};
  var $ = cheerio.load(html);

  var $postInner = $('.art-content .art-Post-inner');
  var icon = readUrl($postInner.find('.art-PostHeader img').attr('src'));

  var $data = $postInner.find('center').eq(0);
  var descriptionTitle = readString($data.contents()[0].data);
  var size = readString($data.contents()[2].data);
  var website = $data.find('a').text();

  var $sections = $postInner.find('.boxinfo').eq(0).find('td');
  var screenshots = getScreenshots($, $sections.eq(0));
  var categories = getCategories($, $sections.eq(1));
  var releases = getReleases($, $sections.eq(2));

  var $statsSection = $sections.eq(3);
  var score = readInt($statsSection.find('font').text());
  var reviewsCount = readInt($statsSection.contents()[6].data);

  var descriptionContent = readString($postInner.find('blockquote p').html());

  var result = {
    icon: icon,
    description: {
      title: descriptionTitle,
      content: descriptionContent,
    },
    website: website,
    size: size,
    screenshots: screenshots,
    releases: releases,
    categories: categories,
    score: score,
    reviewsCount: reviewsCount,
  };

  if (options.reviews) {
    var $reviewRows = $postInner.find('.commentsTable tr');
    result.reviews = getReviews($, $reviewRows, { size: options.reviews });
  }

  return result;
}

module.exports = parsePackageInfo;
