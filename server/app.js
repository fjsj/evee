(function () {
  if (Meteor.isServer) {
    // Serve channel.html file, based on http://stackoverflow.com/a/13871399/145349
    var connect = __meteor_bootstrap__.require("connect");
    var Fiber = __meteor_bootstrap__.require('fibers');
    
    __meteor_bootstrap__.app
      .use(connect.query())
      .use(function(req, res, next) {
        // Need to create a Fiber since we're using synchronous http
        // calls and nothing else is wrapping this in a fiber
        // automatically
        Fiber(function () {
          if (req.url === "/fb/channel.html") {
            // Using caching headers as recommended by https://developers.facebook.com/docs/reference/javascript/#channel
            var momentNextYear = moment().add("years", 1);
            var cacheExpire = 60*60*24*365;
            res.writeHead(200, {
              'Content-Type': 'text/html',
              'Pragma': 'public',
              'Cache-Control': 'max-age=' + cacheExpire,
              'Expires': moment().add("seconds", cacheExpire).format('ddd, DD MMM YYYY hh:mm:ss') + " GMT"
            });
            res.end('<script src="//connect.facebook.net/en_US/all.js"></script>');
          } else {
            // Not an channel.html request. pass to next middleware.
            next();
            return;
          }
        }).run();
      });
  }
})();
