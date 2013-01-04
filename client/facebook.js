Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_events', 'friends_events']
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

var facebook = (function () {
  var fetchEvents = function (accessToken, callback) {
    var timestamp = moment().unix();
    var url = "https://graph.facebook.com/me?fields=friends.fields(events.since(" + timestamp + ").limit(25).fields(id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)))";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, callback);
  };
 
  return {
    fetchEvents: fetchEvents
  };
})();
