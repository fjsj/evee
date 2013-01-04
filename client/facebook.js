Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_events', 'friends_events']
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

var facebook = (function () {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];

  var fetchAndStoreEvents = function (accessToken) {
    var timestamp = moment().unix();
    var url = "https://graph.facebook.com/me?fields=friends.fields(events.since(" + timestamp + ").limit(25).fields(id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, processEvents);
  };

  var processEvents = function (error, result) {
    if (result.statusCode == 200) {
      var json = JSON.parse(result.content);
      var events = jsonToEventList(json);
      sortByDate(events);
      var datesAndEvents = eventsToDatesAndEventsMap(events);
      storeDatesAndEvents(datesAndEvents);
    } else {
      alert("Erro ao importar eventos do Facebook");
    }
  };

  var jsonToEventList = function (json) {
    var eventsIds = {};
    var events = [];
    json.friends.data.forEach(function (friend) {
      if (friend.events) {
        friend.events.data.forEach(function (event) {
          if (!(event.id in eventsIds)) {
            events.push(event);
            eventsIds[event.id] = true;
          }
        });
      }
    });
    return events;
  };

  var sortByDate = function (events) {
    events.sort(function (a, b) {
      return moment(a.start_time, fbDateFormats).valueOf() - moment(b.start_time, fbDateFormats).valueOf();
    });
  };

  var eventsToDatesAndEventsMap = function (events) {
    var datesAndEvents = {};
    events.forEach(function (event) {
      var dateKey = moment(event.start_time, fbDateFormats).format(selectedDate.keyFormat);
      datesAndEvents[dateKey] = datesAndEvents[dateKey] || [];
      datesAndEvents[dateKey].push(event);
    });
    return datesAndEvents;
  };

  var storeDatesAndEvents = function (datesAndEvents) {
    Session.set("datesAndEvents", datesAndEvents);
  };

  var getEventsByDate = function (dateKey) {
    try {
      return Session.get("datesAndEvents")[dateKey];
    } catch (e) {
      return null;
    }
  };

  return {
    fetchAndStoreEvents: fetchAndStoreEvents,
    getEventsByDate: getEventsByDate
  };
})();
