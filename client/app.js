if (Meteor.isClient) {
  Meteor.autorun(function() {
    var userId = Meteor.userId();
    if (userId) {
      Meteor.call("getAccessToken", function (error, accessToken) {
        facebook.fetchAndStoreEvents(accessToken);
      });
    }
  });
}
