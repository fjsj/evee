/**
 * Facebook namespace.
 * Exposes the most important functionalities of this app.
 *
 * Since getter functions use Meteor Session internally,
 * if they are used in reactive contexts, their returned values are updated automagically.
 *
 * login and logout respectively sets and clear the current logged user Facebook access token.
 * getAccessToken returns the logged user (if exists) access token.
 * getUserName works similarly, but returns user's real name.
 * getEventsByDate retuns a list of fetched events objects at a given date, if events were already fetched.
 * * The given date format follows the keyFormat defined in SelectedDate (see selectedDate.js).
 * getEvent returns the event object with the provided id (and starts to fetch its attendees in background).
 * getEventAttendees returns the attendees array of the event with the provided id, if those attendees were already fetched.
 *
 * Events objects are fetched automatically every time access token changes,
 * since the internal fetchAndStoreEvents function is in a autorun context.
 */
var Facebook = (function () {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];
  var sessionKeys = {};

  var getFbDateFormats = function () {
    return _.clone(fbDateFormats); // clone it to avoid accidental changes
  };

  var login = function (accessToken) {
    return Session.set("accessToken", accessToken);
  };

  var getAccessToken = function () {
    return Session.get("accessToken") || null;
  };

  var getUserName = function () {
    return Session.get("userName") || null;
  };

  var setUserName = function (userName) {
    Session.set("userName", userName);
  };

  var fetchAndStoreEvents = function () {
    var accessToken = getAccessToken();
    if (accessToken !== null) {
      var timestamp = moment().startOf("day").unix();
      // Using Facebook Graph API Field Expansion, that's why this is a huge URL.
      // See: https://developers.facebook.com/docs/reference/api/field_expansion/
      var url = "https://graph.facebook.com/me?fields=name,friends.fields(events.since(" + timestamp + ").limit(25).fields(id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
      url += "&access_token=" + accessToken;
      Meteor.http.get(url, {timeout: 30000}, processEvents);
    }
  };

  var processEvents = function (error, result) {
    if (result.statusCode === 200) {
      var json = JSON.parse(result.content);
      setUserName(json.name);
      var events = jsonToEventList(json);
      sortByDate(events);
      var datesAndEvents = eventsToDatesAndEventsMap(events);
      storeDatesAndEvents(datesAndEvents);
    }
  };

  var jsonToEventList = function (json) {
    var eventsIds = {}; // id hashset to avoid event repetition
    var events = [];
    json.friends.data.forEach(function (friend) {
      if (friend.events) {
        friend.events.data.forEach(function (event) {
          if (!(eventsIds.hasOwnProperty(event.id))) { // only push events that weren't already pushed
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
      var dateKey = moment(event.start_time, fbDateFormats).format(SelectedDate.getKeyFormat());
      datesAndEvents[dateKey] = datesAndEvents[dateKey] || {};
      datesAndEvents[dateKey][event.id] = event;
    });
    return datesAndEvents;
  };

  var storeDatesAndEvents = function (datesAndEvents) {
    Session.set("datesAndEvents", datesAndEvents);
  };

  var getEventsByDate = function (dateKey) {
    try {
      return _.values(Session.get("datesAndEvents")[dateKey]);
    } catch (e) {
      return null;
    }
  };

  var getEvent = function (dateKey, id) {
    try {
      var fbEvent = Session.get("datesAndEvents")[dateKey][id];
      if (fbEvent) {
        fetchAndStoreEventAttendees(id);
        return fbEvent;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  var fetchAndStoreEventAttendees = function (id) {
    var accessToken = getAccessToken();
    // Using Facebook Graph API Field Expansion, that's why this is a huge URL.
    // See: https://developers.facebook.com/docs/reference/api/field_expansion/
    var url = "https://graph.facebook.com/" + id + "?fields=attending.limit(1000).fields(name,gender,picture.width(50).height(50))";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, processAttendees);
  };

  var processAttendees = function (error, result) {
    if (result.statusCode === 200) {
      var json = JSON.parse(result.content);
      var attending = json.attending ? json.attending.data : [];
      storeEventAttendees(json.id, attending);
    }
  };

  var storeEventAttendees = function (id, attendeesList) {
    Session.set("attendees" + id, attendeesList);
    sessionKeys["attendees" + id] = true;
  };

  var getEventAttendees = function (id) {
    return Session.get("attendees" + id) || null;
  };

  var logout = function () {
    // Clear all sessionKeys, current accessToken, userName and datesAndEvents map.
    _.extend(sessionKeys, {"accessToken": true, "userName": true, "datesAndEvents": true});
    _.each(_.keys(sessionKeys), function (k) {
      Session.set(k, null);
    });
    sessionKeys = {};
  };

  /*
   * Rerun fetchAndStoreEvents when its dependencies are updated! Meteor deps magic!
   * See: http://docs.meteor.com/#meteor_autorun
   */
  Meteor.autorun(fetchAndStoreEvents);

  return {
    getFbDateFormats: getFbDateFormats,
    login: login,
    getAccessToken: getAccessToken,
    getUserName: getUserName,
    getEventsByDate: getEventsByDate,
    getEvent: getEvent,
    getEventAttendees: getEventAttendees,
    logout: logout
  };
}());
