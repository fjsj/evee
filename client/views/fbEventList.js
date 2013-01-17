/*
 * Template context of selected date events.
 *
 * Reactive context! Values are updated automatically,
 * since SelectedDate and Facebook namespaces
 * use Meteor Session internaly,
 * which is a reactive data source.
 */
Template.todayEvents.todayContext = function () {
  var todayKey = SelectedDate.getAsKey();
  if (todayKey) {
    return {
      'currentDate': SelectedDate.getFormatted(),
      'isLogged': Facebook.getAccessToken() !== null,
      'fbEvents': Facebook.getEventsByDate(todayKey)
    };
  } else {
    return null;
  }
};

/*
 * Template context of selected date (plus 1 day) events.
 *
 * Reactive context! Values are updated automatically,
 * since SelectedDate and Facebook namespaces
 * use Meteor Session internaly,
 * which is a reactive data source.
 */
Template.tomorrowEvents.tomorrowContext = function () {
  var todayKey = SelectedDate.getAsKey();
  if (todayKey) {
    var tomorrowKey = SelectedDate.getTomorrowAsKey();
    return {
      'currentDate': SelectedDate.getTomorrowFormatted(),
      'isLogged': Facebook.getAccessToken() !== null,
      'fbEvents': Facebook.getEventsByDate(tomorrowKey)
    };
  } else {
    return null;
  }
};

/*
 * Fix CSS columns issue by forcing both .day-content to same height.
 */
Template.todayEvents.rendered = function() {
  $helpers.forceAllToSameHeight(".day-content");
};

/*
 * Event list click events.
 * Routes the app to corresponding event page.
 * See routes.js for routes.
 */
(function() {
  var navigateToEventPage = function (ev) {
    $helpers.scrollTo("html, body");
    var fbEvent = this;
    var eventDateKey = moment(fbEvent.start_time, Facebook.fbDateFormats).format(SelectedDate.keyFormat);
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
