var selectedEvent = (function () {
  var get = function () {
    return Session.get("selectedEvent") || null;
  };

  var set = function (event) {
    Session.set("selectedEvent", event);
  };

  var clear = function () {
    Session.set("selectedEvent", null);
  };
  
  return {
    get: get,
    set: set,
    clear: clear
  };
}());

Handlebars.registerHelper("selectedEvent", function () {
  return selectedEvent.get();
});
