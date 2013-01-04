function getEvents (dateKey) {
  try {
    return Session.get("datesAndEvents")[dateKey];
  } catch (e) {
    return null;
  }
}

Template.todayEvents.todayContext = function () {
  var todayKey = Session.get("selectedDate");
  if (todayKey) {
    var today = moment.utc(todayKey, "YYYY-MM-DD");
    return {'currentDate': today.format("DD/MM/YYYY"), 'fbEvents': getEvents(todayKey)};
  } else {
    return null;
  }
};

Template.tomorrowEvents.tomorrowContext = function () {
  var todayKey = Session.get("selectedDate");
  if (todayKey) {
    var tomorrow = moment.utc(todayKey, "YYYY-MM-DD").add("days", 1);
    var tomorrowKey = tomorrow.format("YYYY-MM-DD");
    return {'currentDate': tomorrow.format("DD/MM/YYYY"), 'fbEvents': getEvents(tomorrowKey)};
  } else {
    return null;
  }
};
