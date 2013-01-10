var appConfig = (function () {
  var isLocalhost = window.location.href.indexOf("localhost") !== -1;

  var appId;
  if (isLocalhost) {
    appId = "520006781364253";
  } else {
    appId = "467335689989212";
  }
  
  return {
    isLocalhost: isLocalhost,
    appId: appId
  };
}());
