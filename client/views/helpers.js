Handlebars.registerHelper('ifIsNull', function (value, options) {
  if (value === null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('formatDate', function (value) {
  var localFormat = i18n.getDateFormat();
  return moment(value, facebook.fbDateFormats).format("HH:mm " + localFormat);
});

Handlebars.registerHelper('trans', function (value) {
  return i18n.translate(value);
});

/**
 * Convert new line (\n\r) to <br>
 * from http://phpjs.org/functions/nl2br:480
 */
// https://github.com/danharper/Handlebars-Helpers/blob/master/helpers.js
Handlebars.registerHelper('nl2br', function(text) {
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  return new Handlebars.SafeString(nl2br);
});
