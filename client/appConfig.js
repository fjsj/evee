/**
 * AppConfig namespace.
 * Exposes this app Facebook app ID
 * and a boolean telling if this app is running at dev (localhost).
 * App ID varies if app is running at dev, because domain configurations
 * are hardcoded at Facebook Developers apps page (https://developers.facebook.com/apps).
 */
var AppConfig = (function () {
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
