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
