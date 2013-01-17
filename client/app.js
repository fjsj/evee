if (Meteor.isClient) {
  Meteor.startup(function () {
    /*
     * Finds which is the language of user's browser and sets the current language according to it.
     * See: https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language
     */
    var language = window.navigator.language || window.navigator.userLanguage || "en";
    if (language.indexOf("en-") === 0 || language === "en") {
      I18N.setLanguage("en");
    } else if (language.indexOf("pt-") === 0 || language === "pt") {
      I18N.setLanguage("pt");
    }
  });
}
