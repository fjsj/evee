Handlebars.registerHelper('ifIsNull', function(value, options) {
  if (value === null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('formatDate', function(value) {
  return moment(value, fbDateFormats).format("HH:mm DD/MM/YY");
});
