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

  // http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
  function isScrolledIntoView (selector, fully) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(selector).offset().top;
    var elemBottom = elemTop + $(selector).height();

    var isVisible = (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
    if (fully) {
      return isVisible = isVisible && (elemBottom >= docViewTop) && (elemTop <= docViewBottom);
    }
    return isVisible;
  }

  function scrollTo (selector) {
    $('html, body').animate({
      scrollTop: $(selector).offset().top
    }, 500);
  }

  function scrollToIfHidden (selector, partially, destinationSelector) {
    if (!isScrolledIntoView(selector, partially)) {
      scrollTo(destinationSelector);
    }
  }
  
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

  function getEvents (dateKey) {
    try {
      return Session.get("datesAndEvents")[dateKey];
    } catch (e) {
      return null;
    }
  }

  Template.todayEvents.todayContext = function () {
    var todayKey = Session.get("selectedDate");
    if (todayKey) {
      var today = moment.utc(todayKey, "YYYY-MM-DD");
      return {'currentDate': today.format("DD/MM/YYYY"), 'fbEvents': getEvents(todayKey)};
    } else {
      return null;
    }
  };

  Template.tomorrowEvents.tomorrowContext = function () {
    var todayKey = Session.get("selectedDate");
    if (todayKey) {
      var tomorrow = moment.utc(todayKey, "YYYY-MM-DD").add("days", 1);
      var tomorrowKey = tomorrow.format("YYYY-MM-DD");
      return {'currentDate': tomorrow.format("DD/MM/YYYY"), 'fbEvents': getEvents(tomorrowKey)};
    } else {
      return null;
    }
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
            
            var datesAndEvents = {};
            events.forEach(function (event) {
              var dateKey = moment(event.start_time, fbDateFormats).format("YYYY-MM-DD");
              datesAndEvents[dateKey] = datesAndEvents[dateKey] || [];
              datesAndEvents[dateKey].push(event);
            });
            Session.set("datesAndEvents", datesAndEvents);
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
    }).on('show', function (ev) {
      scrollToIfHidden(".datepicker-dropdown", true, this);
    });
    var currentMoment = moment();
    $('#datepicker input').val(currentMoment.format("DD/MM/YYYY"));
    Session.set("selectedDate", currentMoment.format("YYYY-MM-DD"));
    $('#datepicker').on('changeDate', function (ev) {
      Session.set("selectedDate", moment.utc(ev.date.valueOf()).format("YYYY-MM-DD"));
    });
    $('#datepicker input').click(function (ev) {
      $('#datepicker').datepicker("show");
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
