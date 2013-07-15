// Serve channel.html file
// based on http://stackoverflow.com/a/13871399/145349 and http://blog.mailgun.com/post/demo-meteor-based-emailer-with-geolocation-and-ua-tracking/
Meteor.Router.add('/fb/channel.html', function () {
  // Using caching headers as recommended by https://developers.facebook.com/docs/reference/javascript/#channel
  var momentNextYear = moment().add("years", 1);
  var cacheExpire = 60 * 60 * 24 * 365;
  this.response.writeHead(200, {
    'Content-Type': 'text/html',
    'Pragma': 'public',
    'Cache-Control': 'max-age=' + cacheExpire,
    'Expires': moment().add("seconds", cacheExpire).format('ddd, DD MMM YYYY hh:mm:ss') + " GMT"
  });
  return [200, '<script src="//connect.facebook.net/en_US/all.js"></script>'];
});
