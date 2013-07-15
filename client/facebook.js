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
Facebook = (function () {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];
  var sessionKeys = {};

  // Start of generic private Session functions
  var sessionGetOrNull = function (key) {
    return Session.get(key) || null;
  };
  var sessionSet = function (key, value) {
    Session.set(key, value);
    sessionKeys[key] = true;
  };
  // End of generic private Session functions

  // Start of public general functions
  var getFbDateFormats = function () {
    return _.clone(fbDateFormats); // clone it to avoid accidental changes
  };

  var login = function (accessToken) {
    return sessionSet("accessToken", accessToken);
  };

  var logout = function () {
    // Clear all sessionKeys, including current accessToken, userName and datesAndEvents.
    _.each(_.keys(sessionKeys), function (k) {
      Session.set(k, null);
    });
    sessionKeys = {};

    // Flush HTTP cache
    try {
      ClientStore.flush();
    } catch (e) {
    }
  };

  var getAccessToken = function () {
    return sessionGetOrNull("accessToken");
  };

  var getUserName = function () {
    return sessionGetOrNull("userName");
  };

  var setUserName = function (userName) {
    sessionSet("userName", userName);
  };
  // End of public general functions

  // Start of functions related to event objects
  var shouldCache = !AppConfig.isMobile && ClientStore.isAvailable();

  // Cross-tab/window HTTP cache. Uses ClientStore.
  var cachedFacebookHttpGet = function (url, callback) {
    var cachedValue = null;
    if (shouldCache) {
      try {
        cachedValue = ClientStore.get(url);
      } catch (e) {
      }
    }

    if (cachedValue !== null && !cachedValue[1].error) {
      callback(cachedValue[0], cachedValue[1]);
    } else {
      var cacheAndCallback = function (error, result) {
        // Check if accessToken was valid at request time
        if (result.statusCode == 400) {
          var json = JSON.parse(result.content);
          // Invalid request! Expired accessToken.
          // Page refresh is necessary, to reload Facebook JavaScript SDK.
          if (json.error.type == "OAuthException") {
            window.location.reload();
          }
        } else {
          if (shouldCache) {
            try {
              var value = [error, result];
              ClientStore.set(url, value);
            } catch (e) {
            }
          }

          callback(error, result);
        }
      };
      
      Meteor.http.get(url, {timeout: 30000}, cacheAndCallback);
    }
  };

  var fetchAndStoreEvents = function () {
    var accessToken = getAccessToken();
    if (accessToken !== null) {
      var timestamp = moment().startOf("day").unix();
      // Using Facebook Graph API Field Expansion, that's why this is a huge URL.
      // See: https://developers.facebook.com/docs/reference/api/field_expansion/
      var url = "https://graph.facebook.com/me?fields=name,friends.fields(events.since(" + timestamp + ").limit(25).fields(id,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
      url += "&access_token=" + accessToken;
      cachedFacebookHttpGet(url, processEvents);
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
    if (json.friends) {
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
    }
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
    sessionSet("datesAndEvents", datesAndEvents);
  };

  var getEventsByDate = function (dateKey) {
    var datesAndEvents = sessionGetOrNull("datesAndEvents");
    if (datesAndEvents) {
      return _.values(datesAndEvents[dateKey]);
    } else {
      return null;
    }
  };

  var getEvent = function (dateKey, id) {
    try {
      var fbEvent = sessionGetOrNull("datesAndEvents")[dateKey][id];
      if (fbEvent) {
        fetchAndStoreEventAttendees(id);
        fetchAndStoreEventDescription(id);
        return fbEvent;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };
  // End of functions related to event objects

  // Start of functions related to event attendees
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
    sessionSet("attendees" + id, attendeesList);
  };

  var getEventAttendees = function (id) {
    return sessionGetOrNull("attendees" + id);
  };
  // End of functions related to event attendees

  // Start of functions related to event description
  var fetchAndStoreEventDescription = function (id) {
    var accessToken = getAccessToken();
    var url = "https://graph.facebook.com/" + id + "?fields=description";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, processDescription);
  };

  var processDescription = function (error, result) {
    if (result.statusCode === 200) {
      var json = JSON.parse(result.content);
      var description = json.description ? json.description : "";
      storeEventDescription(json.id, description);
    }
  };

  var storeEventDescription = function (id, description) {
    sessionSet("description" + id, description);
  };

  var getEventDescription = function (id) {
    return sessionGetOrNull("description" + id);
  };
  // End of functions related to event description

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
    getEventDescription: getEventDescription,
    logout: logout
  };
}());
