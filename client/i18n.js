/**
 * Internationalization namespace.
 * Exposes functions that allows translations to supported languages,
 * getting of date formats and getting and setting of currently selected language.
 */
I18N = (function () {
  var messagesEN_PT = {
    "An easy navigation through Facebook events": "Seus eventos do Facebook em um só lugar",
    "Sign in and see all Facebook events you and your friends were invited. An easy and quick way to get social information about events relevant for you.": "Entre e veja os eventos do Facebook que você e seus amigos foram convidados. Uma visualização fácil e rápida de todos eventos relevantes para você.",
    "Step 1: sign in": "Passo 1: entre",
    "Step 2: choose a date": "Passo 2: escolha uma data",
    "Step 3: check the events": "Passo 3: confira os eventos",
    "Loading events...": "Carregando eventos...",
    "No events found at this date :(": "Nenhum evento nesta data :(",
    "Sign in with your Facebook to see events": "Entre com seu Facebook para ver eventos",
    "back to home": "voltar para home",
    "Sign in with Facebook": "Entrar com o Facebook",
    "Step 4: event information": "Passo 4: informações sobre o evento",
    "Details": "Detalhes",
    "view on Facebook": "ver no Facebook",
    "Description": "Descrição",
    "Loading...": "Carregando...",
    "Attending": "Quem vai",
    "No attendees found": "Nenhum encontrado"
  };
  var messagesKeys = _.keys(messagesEN_PT);
  var messagesEN_EN = _.object(messagesKeys, messagesKeys);
  var languages = {
    "en": messagesEN_EN,
    "pt": messagesEN_PT
  };
  var dateFormats = {
    "en": "MM/DD/YYYY",
    "pt": "DD/MM/YYYY"
  };
  var datepickerFormats = {
    "en": "mm/dd/yyyy",
    "pt": "dd/mm/yyyy"
  };

  var translate = function (message) {
    var language = getLanguage();
    return languages[language][message];
  };

  var getDateFormat = function () {
    var language = getLanguage();
    return dateFormats[language];
  };

  var getDatepickerFormat = function () {
    var language = getLanguage();
    return datepickerFormats[language];
  };

  var getLanguage = function (language) {
    return Session.get("language") || "en";
  };

  var setLanguage = function (language) {
    return Session.set("language", language);
  };

  return {
    translate: translate,
    getDateFormat: getDateFormat,
    getDatepickerFormat: getDatepickerFormat,
    getLanguage: getLanguage,
    setLanguage: setLanguage
  };
}());

/*
 * Finds which is the language of user's browser and sets the current language according to it.
 * See: https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language
 */
if (Meteor.isClient) {
  Meteor.startup(function () {
    var language = window.navigator.language || window.navigator.userLanguage || "en";
    if (language.indexOf("en-") === 0 || language === "en") {
      I18N.setLanguage("en");
    } else if (language.indexOf("pt-") === 0 || language === "pt") {
      I18N.setLanguage("pt");
    }
  });
}
