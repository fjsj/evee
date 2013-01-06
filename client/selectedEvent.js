var selectedEvent = (function () {
  var get = function () {
    return Session.get("selectedEvent");
  };

  var set = function (event) {
    Session.set("selectedEvent", event);
  };
  
  return {
    get: get,
    set: set
  };
})();

Handlebars.registerHelper("selectedEvent", function () {
  return selectedEvent.get();
});
