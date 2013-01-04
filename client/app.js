if (Meteor.isClient) {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];

  Meteor.autorun(function() {
    var userId = Meteor.userId();
    if (Meteor.userId()) {
      Meteor.call("getAccessToken", function (error, accessToken) {
        facebook.fetchEvents(accessToken, function (error, result) {
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
              var dateKey = moment(event.start_time, fbDateFormats).format(selectedDate.keyFormat);
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
}
