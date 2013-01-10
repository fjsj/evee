Template.fbEvent.rendered = function () {
  $helpers.forceAllToSameHeight(".event-content");
};

Template.fbEvent.attendees = function () {
  return facebook.getEventAttendees(this.id);
};

Template.fbEvent.maleRatio = function () {
  var attendees = facebook.getEventAttendees(this.id);
  if (attendees && attendees.length) {
    var attendees = _.filter(attendees, function (a) { return a.hasOwnProperty("gender") });
    if (attendees.length) {
      var total = attendees.length;
      var males = _.reduce(attendees, function (memo, a) { return memo + (a.gender === "male" ? 1 : 0) }, 0);
      return Math.floor((males / total) * 100);
    }
  }
  return null;
};

Template.fbEvent.helpers({
  femaleRatio: function (maleRatio) {
    return maleRatio ? 100 - maleRatio : null;
  }
});
