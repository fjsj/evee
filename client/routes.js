Meteor.Router.add({
  '/': function () {
    selectedEvent.clear();
  },
  '/event/:dateKey/:id': function (dateKey, id) {
    var fbEvent = facebook.getEvent(dateKey, id);
    selectedEvent.set(fbEvent);
  }
});
