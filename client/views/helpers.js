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
