/**
 * ClientStore provides a cross-tab/window reactive storage
 * through a localStorage client provided by Meteor.BrowserStore.
 *
 * Exposes get, set and flush operations and
 * a isPolyfill function, which tells if the
 * current localStorage is a polyfill implementation.
 */
var ClientStore = (function () {
  var isPolyfill = function () {
    var l = window.localStorage.length;
    return _.isUndefined(l) || _.isNull(l);
  };

  var get = function (key) {
    var timestampNow = moment().unix();
    var obj = Meteor.BrowserStore.get(key);
    if (obj) {
      if (timestampNow < obj.expire) {
        return obj.value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  var set = function (key, value, expire) {
    if (!expire) {
      expire = moment().add('hours', 1).unix();
    }
    var obj = {'expire': expire, 'value': value};
    Meteor.BrowserStore.set(key, obj);
  };

  var flush = function () {
    var toRemove = [];
    Meteor.BrowserStore._each(function (key) {
      toRemove.push(key);
    });
    _.each(toRemove, function (key) {
      Meteor.BrowserStore.set(key, null);
    });
  };

  return {
    isPolyfill: isPolyfill,
    get: get,
    set: set,
    flush: flush
  };
}());
