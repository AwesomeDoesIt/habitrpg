/**
 * Created by Sabe on 6/11/2015.
 */
'use strict';

describe('Analytics Service', function () {
  var analytics;

  beforeEach(function() {
    inject(function(Analytics) {
      analytics = Analytics;
    });
  });

  context('Amplitude', function() {

    before(function() {
      sinon.stub(amplitude, 'setUserId');
      sinon.stub(amplitude, 'logEvent');
      sinon.stub(amplitude, 'setUserProperties');
      sinon.stub(amplitude, 'logRevenue');
    });

    afterEach(function() {
      amplitude.setUserId.reset();
      amplitude.logEvent.reset();
      amplitude.setUserProperties.reset();
      amplitude.logRevenue.reset();
    });

    after(function() {
      amplitude.setUserId.restore();
      amplitude.logEvent.restore();
      amplitude.setUserProperties.restore();
      amplitude.logRevenue.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(amplitude.setUserId).to.have.been.calledOnce;
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(amplitude.setUserId).to.have.been.calledOnce;
    });

    it('tracks page views', function() {
      analytics.view('/static/front');
      expect(amplitude.logEvent).to.have.been.calledOnce;
      expect(amplitude.logEvent).to.have.been.calledWith('view',{'page':'/static/front'});
    });

    it('tracks a simple user action', function() {
      analytics.track('action');
      expect(amplitude.logEvent).to.have.been.calledOnce;
      expect(amplitude.logEvent).to.have.been.calledWith('action');
    });

    it('tracks a user action with properties', function() {
      analytics.track('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
      expect(amplitude.logEvent).to.have.been.calledOnce;
      expect(amplitude.logEvent).to.have.been.calledWith('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(amplitude.setUserProperties).to.have.been.calledOnce;
      expect(amplitude.setUserProperties).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    });

    it('tracks revenue from purchases', function() {
      analytics.revenue(0.25,20,'Gems');
      expect(amplitude.logRevenue).to.have.been.calledOnce;
      expect(amplitude.logRevenue).to.have.been.calledWith(0.25,20,'Gems');
    });

  });

  context('Google Analytics', function() {

    before(function() {
      sinon.stub(ga);
    });

    afterEach(function() {
      ga.reset();
    });

    after(function() {
      ga.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('create');
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('create');
    });

    it('tracks page views', function() {
      analytics.view('/static/front');
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('send','pageview',{'page':'/static/front'});
    });

    it('tracks a simple user action', function() {
      analytics.track('action');
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('send','event',{'eventCategory':'behavior','eventAction':'action'});
    });

    it('tracks a user action with properties', function() {
      analytics.track('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('send','event',{'eventCategory':'behavior','eventAction':'action','booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('set',{'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});

    });

  });

  context('Mixpanel', function() {

    before(function() {
      sinon.stub(mixpanel, 'alias');
      sinon.stub(mixpanel, 'identify');
      sinon.stub(mixpanel, 'track_links');
      sinon.stub(mixpanel, 'track');
      sinon.stub(mixpanel, 'register');
    });

    afterEach(function() {
      mixpanel.alias.reset();
      mixpanel.identify.reset();
      mixpanel.track_links.reset();
      mixpanel.track.reset();
      mixpanel.register.reset();
    });

    after(function() {
      mixpanel.alias.restore();
      mixpanel.identify.restore();
      mixpanel.track_links.restore();
      mixpanel.track.restore();
      mixpanel.register.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(mixpanel.alias).to.have.been.calledOnce;
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(mixpanel.identify).to.have.been.calledOnce;
    });

    it('tracks page views', function() {
      analytics.view('/static/front');
      expect(mixpanel.track_links).to.have.been.calledOnce;
      expect(mixpanel.track_links).to.have.been.calledWith('/static/front','view',{});
    });

    it('tracks a simple user action', function() {
      analytics.track('action');
      expect(mixpanel.track).to.have.been.calledOnce;
      expect(mixpanel.track).to.have.been.calledWith('action');
    });

    it('tracks a user action with properties', function() {
      analytics.track('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
      expect(mixpanel.track).to.have.been.calledOnce;
      expect(mixpanel.track).to.have.been.calledWith('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(mixpanel.register).to.have.been.calledOnce;
      expect(mixpanel.register).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    });

  });

});
