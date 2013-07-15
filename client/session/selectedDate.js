/**
 * SelectedDate namespace.
 * Exposes functions that get and set the currently selected date.
 * Also exposes a keyFormat for using in dates->events maps.
 *
 * Since getter functions use Meteor Session internally,
 * if they are used in reactive contexts, their returned values are updated automagically.
 *
 * A date is selected through the datepicker (see datepicker.js).
 */
SelectedDate = (function () {
  var keyFormat = "YYYY-MM-DD";

  var getKeyFormat = function () {
    return keyFormat;
  };

  var getAsKey = function () {
    return Session.get("selectedDate");
  };

  var getAsMoment = function () {
    return moment.utc(getAsKey(), keyFormat);
  };
  
  var getFormatted = function () {
    var localFormat = I18N.getDateFormat();
    return getAsMoment().format(localFormat);
  };

  var getTomorrowAsMoment = function () {
    return getAsMoment().add("days", 1);
  };

  var getTomorrowAsKey = function () {
    return getTomorrowAsMoment().format(keyFormat);
  };

  var getTomorrowFormatted = function () {
    var localFormat = I18N.getDateFormat();
    return getTomorrowAsMoment().format(localFormat);
  };

  var setAsMoment = function (asMoment) {
    Session.set("selectedDate", asMoment.format(keyFormat));
  };
  setAsMoment(moment());
 
  return {
    getKeyFormat: getKeyFormat,
    getAsKey: getAsKey,
    getFormatted: getFormatted,
    getTomorrowAsKey: getTomorrowAsKey,
    getTomorrowFormatted: getTomorrowFormatted,
    setAsMoment: setAsMoment
  };
}());
