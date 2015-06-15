/**
 * Created by Sabe on 6/15/2015.
 */
'use strict';

angular
  .module('habitrpg')
  .factory('Analytics', analyticsFactory);

analyticsFactory.$inject = [
  '$rootScope',
  'User'
];

function analyticsFactory($rootScope,User) {

  var user = User.user;

  // Analytics providers should only be active in production
  if (window.env.NODE_ENV === 'production') {

    // Amplitude
    $.getScript('//d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.2.0-min.gz.js', function() {
      amplitude.init(window.env.AMPLITUDE_KEY);
    });

    // Google Experiments
    $.getScript('//www.google-analytics.com/cx/api.js?experiment=t-AFggRWQnuJ6Teck_x1-Q', function(){
      $rootScope.variant = cxApi.chooseVariation();
      $rootScope.$apply();
    });

    // Universal Analytics (Google Analytics)
    $.getScript('//www.google-analytics.com/analytics.js', function() {
      ga('create', window.env.GA_ID, 'auto');
      ga('send', 'pageview');
    });

    // Mixpanel
    $.getScript('//api.mixpanel.com/site_media/js/api/mixpanel.js', function() {
      mixpanel.init(window.env.MIXPANEL_TOKEN);
    });
  }

  function register() {

  }

  function login() {

  }

  function track(action,properties) {
    amplitude.logEvent(action,properties);
    mixpanel.track(action,properties);
    properties.eventAction = action;
    if (!properties.eventCategory) {
      properties.eventCategory = 'behavior';
    }
    ga('send','event',properties);
  }

  function view(page,properties) {
    if (!properties) properties = {};
    mixpanel.track_links(page,'view',properties);
    properties.page = page;
    amplitude.logEvent('view',properties);
    ga('send','pageview',properties);
  }

  function updateUser(properties) {
    properties.UUID = user._id;
    properties.Class = user.stats.class;
    properties.Experience = Math.floor(user.stats.exp);
    properties.Gold = Math.floor(user.stats.gp);
    properties.Health = Math.ceil(user.stats.hp);
    properties.Level = user.stats.lvl;
    properties.Mana = Math.floor(user.stats.mp);
    properties.contributorLevel = user.contributor.level;
    properties.subscription = user.purchased.plan.planId;

    amplitude.setUserProperties(properties);
    ga('set',properties);
    mixpanel.register(properties);
  }

  function revenue() {

  }

  return {
    register: register,
    login: login,
    track: track,
    view: view,
    updateUser: updateUser,
    revenue: revenue
  };

}
