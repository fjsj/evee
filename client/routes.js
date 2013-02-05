/*
 * Client-side routes callbacks.
 * On "/", SelectedEvent is cleared. This clears the event page and makes the app display the start page.
 * On "/event/:dateKey/:id", SelectedEvent is set according to parameter id. This makes the app show the event page.
 * It is enough to set SelectedEvent because it uses Meteor Session internally, so variables that are in reactive contexts
 * and depend upon SelectedEvent values (like template ones) are updated automatically.
 */
Meteor.Router.add({
  '/': function () {
    SelectedEvent.clear();
    return 'main';
  },
  '/event/:dateKey/:id': function (dateKey, id) {
    $helpers.scrollTo("html, body");
    var fbEvent = Facebook.getEvent(dateKey, id);
    SelectedEvent.set(fbEvent);
    return 'main';
  },
  '/test': function () {
    return 'testReport';
  }
});
