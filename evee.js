if (Meteor.isClient) {
  Handlebars.registerHelper('ifIsNull', function(value, options) {
    if (value === null) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  function fetchEvents (accessToken, callback) {
    var timestamp = moment().unix();
    var url = "https://graph.facebook.com/me?fields=friends.fields(events.since(" + timestamp + ").limit(25).fields(id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, callback);
  }

  Template.heroUnit.message = function () {
    return "Encontre eventos em Recife.";
  };
  Template.heroUnit.callToAction = function () {
    return "Cadastre-se agora mesmo com o seu Facebook e veja quais são e quem vai para os principais eventos da cidade!";
  };
  Template.dayEvents.events = function () {
    return Session.get("dayEvents") || null;
  };
  Template.nightEvents.events = function () {
    return Session.get("nightEvents") || null;
  };
  Meteor.startup(function () {
    $('.gmap').mobileGmap();
    fetchEvents(fbAccessToken, function (error, result) {
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
          return moment(a.start_time).valueOf() - moment(b.start_time).valueOf();
        });
        
        var dayEvents = [];
        var nightEvents = [];
        events.forEach(function (event) {
          var startTime = moment(event.start_time);
          var startHour = startTime.hours();
          if (startHour > 6 && startHour < 18) {
            dayEvents.push(event);
          } else {
            nightEvents.push(event);
          }
          
          event.start_time = startTime.format("HH:mm DD/MM/YY");
        });

        Session.set("dayEvents", dayEvents);
        Session.set("nightEvents", nightEvents);
      } else {
        console.log(error);
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
