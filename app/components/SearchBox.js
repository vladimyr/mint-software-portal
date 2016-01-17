'use strict';

var Vue = require('vue');
var autocomplete = require('autocomplete.js');
var api = require('../lib/api.js');
var template = require('lodash/template');
var templateSettings = require('lodash/templateSettings');
var componentTemplate = require('./search.html');

templateSettings.interpolate = /{{([\s\S]+?)}}/g;
var resultTemplate = template(require('./searchResult.html'));

var KEY_ENTER = 13;
var suggestionsLimit = 8;


var SearchBox = Vue.component('search-box', {
  name: 'SearchBox',
  template: componentTemplate,
  ready: function() {
    var input = this.$el.querySelector('input');
    var self = this;

    this.$input = autocomplete(input, {
      hint: false,
      debug: true
    },[{
      source: function(query, done) {
        api.getSearchSuggestions(query)
          .then(function complete(suggestions) {
            done(suggestions.slice(0, suggestionsLimit));
          });
      },
      name: 'packages',
      displayKey: 'name',
      templates: {
        suggestion: function(suggestion) {
          return resultTemplate(suggestion);
        }
      }
    }])
    .on('autocomplete:selected', this.onSelected)
    .on('keydown', function(e) {
      var which = e.which || e.keyCode;
      if (which !== KEY_ENTER)
        return;

      self.onSearch(e, input.value);
    });

    this.$input.autocomplete.setVal(this.$route.query.q || '');
  },
  methods: {
    onSelected: function(e, suggestion) {
      var pkgName = suggestion.name;
      this.selected = true;

      this.$input.autocomplete.setVal('');
      this.$router.go({
        name: 'package',
        params: { name: pkgName }
      });
    },
    onSearch: function(e, query) {
      if (this.selected) {
        this.selected = false;
        return;
      }

      this.$input.autocomplete.close();
      this.$router.go({
        name: 'search',
        query: { q: query }
      });
    }
  }
});

module.exports = SearchBox;

