Template.todayEvents.todayContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    return {
      'currentDate': selectedDate.getFormatted(),
      'isLogged': facebook.getAccessToken() !== null,
      'fbEvents': facebook.getEventsByDate(todayKey)
    };
  } else {
    return null;
  }
};

Template.tomorrowEvents.tomorrowContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    var tomorrowKey = selectedDate.getTomorrowAsKey();
    return {
      'currentDate': selectedDate.getTomorrowFormatted(),
      'isLogged': facebook.getAccessToken() !== null,
      'fbEvents': facebook.getEventsByDate(tomorrowKey)
    };
  } else {
    return null;
  }
};

Template.todayEvents.rendered = function() {
  $helpers.forceAllToSameHeight(".day-content");
};

(function() {
  var navigateToEventPage = function (ev) {
    $helpers.scrollTo("html, body");
    var fbEvent = this;
    var eventDateKey = moment(fbEvent.start_time, facebook.fbDateFormats).format(selectedDate.keyFormat);
    Meteor.Router.to('/event/' + eventDateKey + '/' + fbEvent.id);
    ev.preventDefault();
  };
  var fbEventListEvents = {
    "click .event-info .event-picture a": navigateToEventPage,
    "click .event-info .event-name a": navigateToEventPage
  };

  Template.todayEvents.events(fbEventListEvents);
  Template.tomorrowEvents.events(fbEventListEvents);
}());
