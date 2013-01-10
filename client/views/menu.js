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
