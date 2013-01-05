if (Meteor.isClient) {
  Meteor.autorun(function () {
    var userId = Meteor.userId();
    if (userId) {
      Meteor.call("getAccessToken", function (error, accessToken) {
        facebook.fetchAndStoreEvents(accessToken);
      });
    }
  });

  Meteor.startup(function () {
    // https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language
    var language = window.navigator.language || window.navigator.userLanguage || "en";
    if (language.indexOf("en-") === 0 || language === "en") {
      i18n.setLanguage("en");
    } else if (language.indexOf("pt-") === 0 || language === "pt") {
      i18n.setLanguage("pt");
    }
  });
}
