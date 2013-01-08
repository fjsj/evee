var selectedDate = (function () {
  var keyFormat = "YYYY-MM-DD";

  var getAsKey = function () {
    return Session.get("selectedDate");
  };

  var getAsMoment = function () {
    return moment.utc(getAsKey(), keyFormat);
  };
  
  var getFormatted = function () {
    var localFormat = i18n.getDateFormat();
    return getAsMoment().format(localFormat);
  };

  var getTomorrowAsMoment = function () {
    return getAsMoment().add("days", 1);
  };

  var getTomorrowAsKey = function () {
    return getTomorrowAsMoment().format(keyFormat);
  };

  var getTomorrowFormatted = function () {
    var localFormat = i18n.getDateFormat();
    return getTomorrowAsMoment().format(localFormat);
  };

  var setAsMoment = function (asMoment) {
    Session.set("selectedDate", asMoment.format(keyFormat));
  };
  setAsMoment(moment());
 
  return {
    keyFormat: keyFormat,
    getAsKey: getAsKey,
    getFormatted: getFormatted,
    getTomorrowAsKey: getTomorrowAsKey,
    getTomorrowFormatted: getTomorrowFormatted,
    setAsMoment: setAsMoment
  };
}());
