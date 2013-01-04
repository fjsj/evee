Meteor.methods({
  getAccessToken: function () {
    try {
      return Meteor.user().services.facebook.accessToken;
    } catch (e) {
      return null;
    }
  }
});
