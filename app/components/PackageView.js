'use strict';

var Vue = require('vue');
var assign = require('lodash/assign');
var api = require('../lib/api.js');
var template = require('./package.html');
var avatarTemplate = require('./avatar.html');

var AvatarView = Vue.extend({
  template: avatarTemplate,
  props: {
    username: {
      type: String,
      required: true
    },
    url: String
  }
});

var PackageView = Vue.extend({
  template: template,
  name: 'PackageView',
  data: function() {
    return {
      icon: '',
      description: {
        title: '',
        content: ''
      },
      screenshots: [],
      score: 0,
      size: '',
      website: '',
      categories: [],
      releases: [],
      reviewsCount: 0,
      reviews: []
    };
  },
  components: {
    'avatar-view': AvatarView
  },
  route: {
    data: function(transition) {
      return this.getPackageInfo(transition.to.params.name);
    }
  },
  methods: {
    getPackageInfo: function(name) {
      var self = this;

      api.getPackageInfo(name)
        .then(function complete(pkg) {
          assign(self, pkg);
        });
    }
  }
});

module.exports = PackageView;
