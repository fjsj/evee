var i18n = (function () {
  var messagesPT_EN = {
    "Seus eventos do Facebook em um só lugar": "An easy navigation through Facebook events"
  };
  var messagesKeys = _.keys(messagesPT_EN);
  var messagesPT_PT = _.object(messagesKeys, messagesKeys);
  var languages = {
    "EN": messagesPT_EN,
    "PT": messagesPT_PT
  };

  var translate = function (message) {
    var language = Session.get("language", language) || "EN";
    return languages[language][message];
  };

  var setLanguage = function (language) {
    return Session.set("language", language);
  }

  return {
    translate: translate,
    setLanguage: setLanguage
  };
})();
