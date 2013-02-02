/*
 * Loads the Facebook JavaScript SDK when fbLogin template is created.
 */
Template.fbLogin.created = function () {
  // See Facebook JavaScript JDK docs at: https://developers.facebook.com/docs/reference/javascript/
  window.fbAsyncInit = function() {
    // Init the FB JS SDK
    var initConfig = {
      appId      : AppConfig.appId, // App ID from the App Dashboard
      status     : false, // check the login status upon init?
      cookie     : false, // set sessions cookies to allow your server to access the session?
      xfbml      : false  // parse XFBML tags on this page?
    };
    if (!AppConfig.isLocalhost) { // Serve channel.html file only on production
      initConfig["channelUrl"] = Meteor.absoluteUrl("fb/channel.html");
    }
    FB.init(initConfig);

    // Sync Facebook login status with this app login status (automatically logging in if necessary).
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        Facebook.login(response.authResponse.accessToken);
      } else if (response.status === 'not_authorized') {
        // not_authorized
      } else {
        // not_logged_in
      }
    });
  };

  // Load the SDK's source Asynchronously
  (function(d, debug){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
     ref.parentNode.insertBefore(js, ref);
   }(document, /*debug*/ false));
};

/*
 * Current user template variables.
 *
 * Reactive context! Values are updated automatically,
 * since Facebook namespace uses Meteor Session internaly,
 * which is a reactive data source.
 */
Template.fbLogin.isLogged = function () {
  return Facebook.getAccessToken() !== null;
};

Template.fbLogin.userName = function () {
  return Facebook.getUserName() || '';
};

/*
 * Facebook login click events.
 * Clicking in #login-button opens the Facebook JavaScript SDK login pop-up.
 * Clicking in #logout-button logs out the user from Facebook and from this app.
 */
(function () {
  var showLoginPopup = function () {
    FB.login(function(response) {
      if (response.authResponse) {
        Facebook.login(response.authResponse.accessToken);
      } else {
        // cancelled
      }
    }, {scope: 'user_events,friends_events'});
  };
  
  Template.fbLogin.events({
    "click #login-button": function () {
      showLoginPopup();
    },
    "click #logout-button": function () {
      FB.logout(function(response) {
        // logged out
      });
      Facebook.logout();
    }
  });
}());
