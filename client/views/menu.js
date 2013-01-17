/*
 * Menu click events.
 * When clicking in the brand or in the back button, route the browser to "/".
 * See routes.js for routes.
 */
Template.menu.events({
  "click a.brand": function (ev) {
    Meteor.Router.to("/");
    ev.preventDefault();
  },
  "click .back-home a": function (ev) {
    Meteor.Router.to("/");
    ev.preventDefault();
  }
});
