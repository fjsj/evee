var login = function (accessToken) {
  facebook.setAccessToken(accessToken);
};

var logout = function () {
  FB.logout(function(response) {
    // logged out
  });
  facebook.setAccessToken(null);
  facebook.setUserName(null);
};

var showLoginPopup = function () {
  FB.login(function(response) {
    if (response.authResponse) {
      login(response.authResponse.accessToken); 
    } else {
      // cancelled
    }
  }, {scope: 'user_events,friends_events'});
};

Template.fbLogin.created = function () {
  if (!Session.get("is Facebook JDK loaded?")) {
    Session.set("is Facebook JDK loaded?", true);
    
    // https://developers.facebook.com/docs/reference/javascript/
    window.fbAsyncInit = function() {
      // init the FB JS SDK
      var initConfig = {
        appId      : appConfig.appId, // App ID from the App Dashboard
        status     : false, // check the login status upon init?
        cookie     : false, // set sessions cookies to allow your server to access the session?
        xfbml      : false  // parse XFBML tags on this page?
      };
      if (!appConfig.isLocalhost) {
        initConfig["channelUrl"] = Meteor.absoluteUrl("fb/channel.html");
      }
      FB.init(initConfig);

      // Additional initialization code such as adding Event Listeners goes here
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          login(response.authResponse.accessToken);
        } else if (response.status === 'not_authorized') {
          // not_authorized
        } else {
          // not_logged_in
        }
      });
    };

    // Load the SDK's source Asynchronously
    // Note that the debug version is being actively developed and might 
    // contain some type checks that are overly strict. 
    // Please report such bugs using the bugs tool.
    (function(d, debug){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
       ref.parentNode.insertBefore(js, ref);
     }(document, /*debug*/ false));
  }
};

Template.fbLogin.isLogged = function () {
  return facebook.getAccessToken() !== null;
};

Template.fbLogin.userName = function () {
  return facebook.getUserName() || '';
};

Template.fbLogin.events({
  "click #login-button": function () {
    showLoginPopup();
  },
  "click #logout-button": function () {
    logout();
  }
});