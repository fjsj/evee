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

var fbEventListEvents = {
  "click .event-info .event-picture": function (ev) {
    selectedEvent.set(this);
  },
  "click .event-info .event-name": function (ev) {
    selectedEvent.set(this);
  }
}

Template.todayEvents.events(fbEventListEvents);
Template.tomorrowEvents.events(fbEventListEvents);
