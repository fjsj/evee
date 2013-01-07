Template.todayEvents.todayContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    return {'currentDate': selectedDate.getFormatted(), 'fbEvents': facebook.getEventsByDate(todayKey)};
  } else {
    return null;
  }
};

Template.tomorrowEvents.tomorrowContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    var tomorrowKey = selectedDate.getTomorrowAsKey();
    return {'currentDate': selectedDate.getTomorrowFormatted(), 'fbEvents': facebook.getEventsByDate(tomorrowKey)};
  } else {
    return null;
  }
};

Template.todayEvents.rendered = function() {
  $helpers.forceAllToSameHeight(".day-content");
};

var fbEventListEvents = {
  "click .event-info .event-picture a": function (ev) {
    $helpers.scrollTo("html, body");
    selectedEvent.set(this);
    ev.preventDefault();
  },
  "click .event-info .event-name a": function (ev) {
    $helpers.scrollTo("html, body");
    selectedEvent.set(this);
    ev.preventDefault();
  }
};

Template.todayEvents.events(fbEventListEvents);
Template.tomorrowEvents.events(fbEventListEvents);
