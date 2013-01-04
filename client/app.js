if (Meteor.isClient) {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];

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
}
