if (Meteor.isClient) {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];

  Handlebars.registerHelper('ifIsNull', function(value, options) {
    if (value === null) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper('formatDate', function(value) {
    return moment(value, fbDateFormats).format("HH:mm DD/MM/YY");
  });
  
  Accounts.ui.config({
    requestPermissions: {
      facebook: ['user_events', 'friends_events']
    },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });

  function fetchEvents (accessToken, callback) {
    var timestamp = moment().unix();
    var url = "https://graph.facebook.com/me?fields=friends.fields(events.since(" + timestamp + ").limit(25).fields(id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, callback);
  }

  function getEvents (dayOrNight) {
    try {
      var selectedMoment = moment.utc(Session.get("selectedDate"));
      var date = selectedMoment.date();
      var month = selectedMoment.month();
      var year = selectedMoment.year();
      return Session.get(dayOrNight).filter(function (event) {
        var m = moment(event.start_time, fbDateFormats);
        return m.year() === year && m.month() === month && m.date() === date;
      });
    } catch (e) {
      return null;
    }
  }

  Template.dayEvents.dayContext = function () {
    return {'fbEvents': getEvents("dayEvents")};
  };

  Template.nightEvents.nightContext = function () {
    return {'fbEvents': getEvents("nightEvents")};
  };

  Meteor.autorun(function() {
    var userId = Meteor.userId();
    if (Meteor.userId()) {
      Meteor.call("getAccessToken", function (error, accessToken) {
        fetchEvents(accessToken, function (error, result) {
          if (result.statusCode == 200) {
            var json = JSON.parse(result.content);
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
            
            events.sort(function (a, b) {
              return moment(a.start_time, fbDateFormats).valueOf() - moment(b.start_time, fbDateFormats).valueOf();
            });
            
            var dayEvents = [];
            var nightEvents = [];
            events.forEach(function (event) {
              var startTime = moment(event.start_time, fbDateFormats);
              var startHour = startTime.hours();
              if (startHour > 6 && startHour < 18) {
                dayEvents.push(event);
              } else {
                nightEvents.push(event);
              }
            });

            Session.set("dayEvents", dayEvents);
            Session.set("nightEvents", nightEvents);
          } else {
            
          }
        });
      });
    } else {
      
    }
  });
  Meteor.startup(function () {
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayBtn: "linked",
      todayHighlight: true
    });
    var currentMoment = moment();
    $('#datepicker input').val(currentMoment.format("DD/MM/YYYY"));
    Session.set("selectedDate", currentMoment.valueOf());
    $('#datepicker').on('changeDate', function (ev) {
      Session.set("selectedDate", ev.date.valueOf());
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      getAccessToken : function () {
        try {
          return Meteor.user().services.facebook.accessToken;
        } catch (e) {
          return null;
        }
      }
    }); 
  });
}
