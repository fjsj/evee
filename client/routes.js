Meteor.Router.add({
  '/': function () {
    SelectedEvent.clear();
  },
  '/event/:dateKey/:id': function (dateKey, id) {
    var fbEvent = Facebook.getEvent(dateKey, id);
    SelectedEvent.set(fbEvent);
  }
});
