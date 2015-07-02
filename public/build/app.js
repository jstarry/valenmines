var LevelButton = React.createClass({displayName: "LevelButton",
  getInitialState: function() {
    return {pressed: this.props.initialPressed};
  },
  handleOnClick: function() {
    this.props.onSelect(this.props.level);
  },
  render: function() {
    return (
      React.createElement("div", {className: "levelButton", onClick: this.handleOnClick}, 
        this.props.level
      )
    );
  }
});

var LevelSelector = React.createClass({displayName: "LevelSelector",
  handleOnSelect: function(level) {
    this.props.onLevelSelect(level);
  },
  render: function() {
    var data = this.props.data;
    var numLevels = data.length;
    var levelButtons = new Array(numLevels);
    for (var i = 0; i < numLevels; i++) {
      var selected = data[i] == this.props.selectedLevel;
      levelButtons[i] = React.createElement(LevelButton, {key: i, level: data[i], initialPressed: selected, onSelect: this.handleOnSelect});
    }
    return (
      React.createElement("div", {className: "levelSelector"}, 
        levelButtons
      )
    );
  },
});

var LoginButton = React.createClass({displayName: "LoginButton",
  render: function() {
    if (this.props.loggedIn) {
      return (
        React.createElement("button", {className: "twitter", onClick: this.props.onLogout}, 
          "Sign out"
        )
      );
    } else {
      return (
        React.createElement("button", {className: "twitter", onClick: this.props.onLogin}, 
          "Sign in"
        )
      );
    }
  }
});

var Score = React.createClass({displayName: "Score",
  render: function() {
    return (
      React.createElement("div", {className: "score"}, 
        React.createElement("span", {className: "username"}, this.props.username), 
        React.createElement("span", {className: "score"}, this.props.score)
      )
    );
  }
});

var Highscores = React.createClass({displayName: "Highscores",
  getInitialState: function() {
    return {
      highscores: null
    };
  },

  componentWillMount: function() {
    var that = this;
    this.id = 100;
    this.props.server.getTopScores(this.props.level, function(data) {
      var highscores = [];
      for (var child in data) {
        var score = data[child];
        highscores.push({
          username: score.username,
          score: score.score,
        });
      }
      highscores.sort(function(a, b) {
        return a.score > b.score;
      })
      that.setState({highscores: highscores});
    });
  },

  render: function() {
    var highscores = this.state.highscores;
    if (highscores != null && highscores.length > 0) {
      var numScores = highscores.length;
      var scores = new Array(numScores);
      for (var i = 0; i < numScores; i++) {
        score = highscores[i];
        scores[i] = React.createElement(Score, {key: i * this.id, username: score.username, score: score.score});
      }
      this.id += 100;
      return (
        React.createElement("div", {className: "scores"}, 
          scores
        )
      );
    } else {
      return (
        React.createElement("span", null, "Nothing")
      );
    }
  }
});

var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {
      level: 'S',
      highscores: null
    };
  },
  getDefaultProps: function() {
    return {
      key: 1,
      server: new Server()
    };
  },
  getLevelBoard: function(level) {
    if (level == 'S') return SMALL_BOARD;
    if (level == 'M') return MEDIUM_BOARD;
    if (level == 'L') return LARGE_BOARD;
  },
  handleLevelSelect: function(level) {
    if (level == this.state.level) {
      this.props.server.saveScore(this.state.level, 25);
      return;
    }
    this.props.key++;
    this.replaceState({level: level});
  },
  handleLogin: function() {
    var that = this;
    this.props.server.login(function() {
      that.forceUpdate();
    });
  },
  handleLogout: function() {
    this.props.server.logout();
    this.forceUpdate();
  },
  render: function() {
    var levels = ['S', 'M', 'L'];
    var levelBoard = this.getLevelBoard(this.state.level);
    var server = this.props.server;
    var rows = levelBoard.rows;
    var cols = levelBoard.cols;
    var heartLims = levelBoard.heartLims;
    var mineCount = levelBoard.mineCount;
    var mineController = new MineController(rows, cols, heartLims, mineCount);
    var mineSweeperProps = {
      rows: rows,
      cols: cols,
      mineCount: mineCount,
      mineController: mineController,
      server: server,
      level: this.state.level
    };
    return (
      React.createElement("div", {className: "app unselectable", key: this.props.key}, 
        React.createElement("div", {className: "main"}, 
          React.createElement("div", {className: "menu"}, 
            React.createElement(LevelSelector, {data: levels, selectedLevel: this.state.level, onLevelSelect: this.handleLevelSelect}), 
            React.createElement(LoginButton, {loggedIn: this.props.server.loggedIn(), onLogin: this.handleLogin, onLogout: this.handleLogout})
          ), 
          React.createElement(MineSweeper, React.__spread({},  mineSweeperProps))
        ), 
        React.createElement(Highscores, {level: this.state.level, server: this.props.server})
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
