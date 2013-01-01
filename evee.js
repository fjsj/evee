if (Meteor.isClient) {
  Template.heroUnit.message = function () {
    return "Encontre eventos em Recife.";
  };
  Template.heroUnit.callToAction = function () {
    return "Cadastre-se agora mesmo com o seu Facebook e veja quais são e quem vai para os principais eventos da cidade!";
  }
  Meteor.startup(function () {
    $('.gmap').mobileGmap();
    var url = "https://graph.facebook.comacasadocachorropreto/events?fields=id,description,start_time,end_time,location,name,venue,picture.width(100).height(100).type(square)";
    url += "&access_token=" + fbAccessToken;
    Meteor.http.get(url, {timeout: 30000}, function(error, result) {
      if (result.statusCode == 200) {
        var json = JSON.parse(result.content);
        console.log(json);
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
