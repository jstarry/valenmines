var Server = function() {
  this.ref = new Firebase('https://valenmines.firebaseio.com/');
  this.users = this.ref.child('users');
  this.scores = this.ref.child('scores');
  var callback = function(authData) {
    if (authData) {
      this.uid = authData.uid;
      this.username = authData.twitter.username;
    }
  }.bind(this);
  this.ref.onAuth(callback);
};

Server.prototype.saveScore = function(level, score) {
  this.scores.child(level).push({
    user: this.uid,
    username: this.username,
    score: score
  });
};

Server.prototype.getUser = function() {
  var auth = this.ref.getAuth();
  if (auth) {
    return {
      username: auth.username,
      pic: authData.twitter.cachedUserProfile.profile_image_url
    };
  }
  return null;
};

Server.prototype.loggedIn = function() {
  if (this.ref.getAuth()) {
    return true;
  }
  return false;
};

Server.prototype.logout = function() {
  this.ref.unauth();
};

Server.prototype.login = function(callback) {
  var users = this.users;
  this.ref.authWithOAuthPopup("twitter", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      users.child(authData.uid).set({
        by: authData.twitter.username,
        pic: authData.twitter.cachedUserProfile.profile_image_url
      });
      callback();
    }
  });
};

Server.prototype.getTopScores = function(level, callback) {
  this.scores.child(level).orderByChild("score").limitToFirst(10).on("value", function(data) {
    callback(data.val());
  });
};
