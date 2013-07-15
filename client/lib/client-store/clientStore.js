/**
 * ClientStore provides a cross-tab/window reactive storage
 * through a localStorage client provided by Meteor.BrowserStore.
 *
 * Exposes get, set and flush operations and
 * a isAvailable function, which tells if
 * localStorage is implemented in client.
 */
ClientStore = (function () {
  var keys = [];

  var isAvailable = function () {
    return Modernizr.localstorage;
  };

  var get = function (key) {
    var timestampNow = moment().unix();

    var obj = localStorage.getItem(key);
    if (obj) {
      if (timestampNow < obj.expire) {
        return obj.value;
      } else {
        localStorage.removeItem(key);
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
    localStorage.setItem(key, obj);
    keys.push(key);
  };

  var flush = function () {
    _(keys).each(function (key) {
      localStorage.removeItem(key);
    });
    keys = [];
  };

  return {
    isAvailable: isAvailable,
    get: get,
    set: set,
    flush: flush
  };
}());
