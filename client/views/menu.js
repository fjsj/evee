Template.menu.events({
  "click a.brand": function (ev) {
    $helpers.scrollTo("html, body");
    selectedEvent.clear();
    ev.preventDefault();
  },
  "click .back-home a": function (ev) {
    $helpers.scrollTo("html, body");
    selectedEvent.clear();
    ev.preventDefault();
  }
});
