Template.testReport.created = function () {
  this.$cssBootstrap = $('head link[rel=stylesheet][href*=bootstrap]').detach();
  this.$cssMain = $('head link[rel=stylesheet][href*=main]').detach();
  this.$cssEvent = $('head link[rel=stylesheet][href*=event]').detach();
  Tests.runAll();
};

Template.testReport.destroyed = function () {
  this.$cssBootstrap.appendTo('head');
  this.$cssMain.appendTo('head');
  this.$cssEvent.appendTo('head');
};
