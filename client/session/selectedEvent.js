/**
 * SelectedEvent namespace.
 * Exposes functions that get and set the currently selected event.
 *
 * Since get function use Meteor Session internally,
 * if it is used in reactive contexts, its returned value is updated automagically.
 *
 * An event is selected when clicked at. Then its page is loaded.
 */
SelectedEvent = (function () {
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

/*
 * selectedEvent template helper.
 * Lets template code to get the currently selected event (if exists).
 */
Handlebars.registerHelper("selectedEvent", function () {
  return SelectedEvent.get();
});
