if (Meteor.isClient) {
  Template.heroUnit.message = function () {
    return "Encontre eventos em Recife.";
  };
  Template.heroUnit.callToAction = function () {
    return "Cadastre-se agora mesmo com o seu Facebook e veja quais são e quem vai para os principais eventos da cidade!";
  }
  Meteor.startup(function () {
    $('.gmap').mobileGmap();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
