Tests.add(function (APP_ACCESS_TOKEN) {
  var eventDt = moment().format("YYYY-MM-DDThh:mm:ssZZ");

  // See: https://developers.facebook.com/docs/test_users/
  var fetchTestUsers = function (callback) {
    var url = "https://graph.facebook.com/" + AppConfig.appId + "/accounts/test-users?access_token=" + APP_ACCESS_TOKEN;
    Meteor.http.get(url, {timeout: 30000}, function (error, result) {
      var json = JSON.parse(result.content);
      callback(json);
    });
  };

  var addTestUser = function (callback) {
    var url = "https://graph.facebook.com/" + AppConfig.appId + "/accounts/test-users?";
    var urlParams = {
      "installed": "true",
      "name": "Test evee User",
      "locale": "en_US",
      "permissions": "create_event,user_events,friends_events",
      "method": "post",
      "access_token": APP_ACCESS_TOKEN
    };
    url += $.param(urlParams);
    Meteor.http.post(url, {timeout: 30000}, function (error, result) {
      var json = JSON.parse(result.content);
      callback(json);
    });
  };

  var addFriendship = function (user1, user2, callback) {
    var url1 = "https://graph.facebook.com/" + user1.id + "/friends/" + user2.id + "?method=post&access_token=" + user1.access_token;
    var url2 = "https://graph.facebook.com/" + user2.id + "/friends/" + user1.id + "?method=post&access_token=" + user2.access_token;
    Meteor.http.get(url1, {timeout: 30000}, function (error, result) {
      Meteor.http.get(url2, {timeout: 30000}, function (error, result) {
        callback();
      });
    });
  };

  var addEventOnTestUser = function (user, callback) {
    var headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"};
    var url = "https://graph.facebook.com/" + user.id + "/events";
    var params = {
      "name": "Test Event",
      "start_time": eventDt,
      "access_token": user.access_token
    };
    Meteor.http.post(url, {headers: headers, params: params, timeout: 30000}, function (error, result) {
      var json = JSON.parse(result.content);
      callback(json);
    });
  };

  // Testing with mocha.
  // See: http://visionmedia.github.com/mocha/
  // Using Chai expect assertion style.
  // See: http://chaijs.com/api/bdd/
  var expect = chai.expect;

  describe('Facebook', function () {
    var user1 = null;
    var user2 = null;
    var eventId = null;
    
    this.timeout(5 * 60 * 1000);  // 5 minutes suit timeout

    before(function (done) {
      if (!APP_ACCESS_TOKEN) {
        throw new Error("Invalid access token");
      }

      fetchTestUsers(function (json) {
        if (json.data.length >= 2) {
          user1 = json.data[0];
          user2 = json.data[1];
          addFriendship(user1, user2, function() {
            addEventOnTestUser(user2, function(json) {
              eventId = json.id;
              done();
            });
          });
        } else if (json.data.length == 1) {
          user1 = json.data[0];
          addTestUser(function (json) {
            user2 = json;
            addFriendship(user1, user2, function() {
              addEventOnTestUser(user2, function(json) {
                eventId = json.id;
                done();
              });
            });
          });
        } else {
          addTestUser(function (json) {
            user1 = json;
            addTestUser(function (json) {
              user2 = json;
              addFriendship(user1, user2, function() {
                addEventOnTestUser(user2, function(json) {
                  eventId = json.id;
                  done();
                });
              });
            });
          });
        }
      });
    });

    beforeEach(function () {
      Facebook.logout();
      ClientStore.flush();
    });

    afterEach(function () {
      Facebook.logout();
      ClientStore.flush();
    });

    describe('#login()', function () {
      it('should set accessToken', function () {
        Facebook.login(user1.access_token);
        var accessToken = Facebook.getAccessToken();
        expect(accessToken).to.not.be.null;
        expect(accessToken).to.be.equal(user1.access_token);
      });

      it('should automatically fetch friends events', function (done) {
        Facebook.login(user1.access_token);

        Meteor.autorun(function () {
          try {
            var eventDtAsKey = moment(eventDt, "YYYY-MM-DDThh:mm:ssZZ").format(SelectedDate.getKeyFormat());
            var fbEvents = Facebook.getEventsByDate(eventDtAsKey);
            if (fbEvents) {
              expect(fbEvents).to.be.an.instanceof(Array);
              expect(fbEvents).to.have.length(1);
              expect(fbEvents[0].id).to.be.equal(eventId);
              done();
            }
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });
});
