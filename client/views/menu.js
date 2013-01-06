Template.menu.events({
  "click .brand": function (ev) {
    selectedEvent.clear();
    ev.preventDefault();
  },
  "click .back-home": function (ev) {
    selectedEvent.clear();
    ev.preventDefault();
  }
});
