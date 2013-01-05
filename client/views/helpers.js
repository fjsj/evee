Handlebars.registerHelper('ifIsNull', function (value, options) {
  if (value === null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('formatDate', function (value) {
  return moment(value, facebook.fbDateFormats).format("HH:mm DD/MM/YY");
});

Handlebars.registerHelper('trans', function (value) {
  return i18n.translate(value);
});
