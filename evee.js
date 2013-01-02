if (Meteor.isClient) {
  Handlebars.registerHelper('ifIsNull', function(value, options) {
    if (value === null) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  function fetchEvents (accessToken, callback) {
    var url = "https://graph.facebook.com/acasadocachorropreto/events?fields=id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)";
    url += "&access_token=" + accessToken;
    Meteor.http.get(url, {timeout: 30000}, callback);
  }

  Template.heroUnit.message = function () {
    return "Encontre eventos em Recife.";
  };
  Template.heroUnit.callToAction = function () {
    return "Cadastre-se agora mesmo com o seu Facebook e veja quais são e quem vai para os principais eventos da cidade!";
  };
  Template.morningEvents.events = function () {
    return Session.get("events") || null;
  };
  Template.morningEvents.rendered = function () {
    // see: http://dotdotdot.frebsite.nl/
    $('.event-name').dotdotdot({watch: true});
  }
  Meteor.startup(function () {
    $('.gmap').mobileGmap();
    fetchEvents(fbAccessToken, function (error, result) {
      if (result.statusCode == 200) {
        var json = JSON.parse(result.content);
        Session.set("events", json.data)
      } else {
        console.log(error);
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
