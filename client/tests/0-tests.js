var Tests = (function () {
  var testList = [];

  var add = function (t) {
    testList.push(t);
  };

  var runAll = function () {
    var APP_ACCESS_TOKEN = prompt("Please input your APP_ACCESS_TOKEN");
    _.each(testList, function (t) {
      t(APP_ACCESS_TOKEN);
    });
  };

  return {
    add: add,
    runAll: runAll
  };
}());
