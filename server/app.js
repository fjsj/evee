(function () {
  if (Meteor.isServer) {
    // serve channel.html file, based on http://stackoverflow.com/a/13871399/145349
    var connect = __meteor_bootstrap__.require("connect");

    __meteor_bootstrap__.app
      .use(connect.query())
      .use(function(req, res, next) {
        // Need to create a Fiber since we're using synchronous http
        // calls and nothing else is wrapping this in a fiber
        // automatically
        Fiber(function () {
          if (req.url === "/fb/channel.html") {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<script src="//connect.facebook.net/en_US/all.js"></script>');
          } else {
            // not an channel.html request. pass to next middleware.
            next();
            return;
          }
        }).run();
      });
  }
})();
