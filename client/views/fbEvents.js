Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_events', 'friends_events']
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

function getEvents (dateKey) {
  try {
    return Session.get("datesAndEvents")[dateKey];
  } catch (e) {
    return null;
  }
}

Template.todayEvents.todayContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    return {'currentDate': selectedDate.getFormatted(), 'fbEvents': getEvents(todayKey)};
  } else {
    return null;
  }
};

Template.tomorrowEvents.tomorrowContext = function () {
  var todayKey = selectedDate.getAsKey();
  if (todayKey) {
    var tomorrowKey = selectedDate.getTomorrowAsKey();
    return {'currentDate': selectedDate.getTomorrowFormatted(), 'fbEvents': getEvents(tomorrowKey)};
  } else {
    return null;
  }
};
