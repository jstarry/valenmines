'use strict';

var dom = React.DOM;
var createEl = React.createElement.bind(React);

var LevelButton = React.createClass({
  getInitialState: function() {
    return {pressed: this.props.initialPressed};
  },
  handleOnClick: function() {
    this.props.onSelect(this.props.level);
  },
  render: function() {
    return (
      dom.div({className: 'levelButton', onClick: this.handleOnClick},
        dom.span({}, this.props.level))
    );
  }
});

var LevelSelector = React.createClass({
  handleOnSelect: function(level) {
    this.props.onLevelSelect(level);
  },
  render: function() {
    var data = this.props.data;
    var numLevels = data.length;
    var levelButtons = new Array(numLevels);
    for (var i = 0; i < numLevels; i++) {
      var selected = data[i] == this.props.selectedLevel;
      levelButtons[i] = createEl(LevelButton, {key: i, level: data[i], initialPressed: selected, onSelect: this.handleOnSelect});
    }
    return (
      dom.div({className: 'levelSelector'}, levelButtons)
    );
  },
});

var LoginButton = React.createClass({
  render: function() {
    if (this.props.loggedIn) {
      return (
        dom.button({className: 'twitter', onClick: this.props.onLogout}, 'Sign Out')
      );
    } else {
      return (
        dom.button({className: 'twitter', onClick: this.props.onLogin}, 'Sign In')
      );
    }
  }
});

var Score = React.createClass({
  render: function() {
    return (
      dom.div({className: 'score'},
        dom.span({className: 'username'}, this.props.username),
        dom.span({className: 'score'}, this.props.score))
    );
  }
});

var Highscores = React.createClass({
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
        return a.score - b.score;
      });
      that.setState({highscores: highscores});
    });
  },

  render: function() {
    var highscores = this.state.highscores;
    if (highscores != null && highscores.length > 0) {
      var numScores = highscores.length;
      var scores = new Array(numScores);
      for (var i = 0; i < numScores; i++) {
        var score = highscores[i];
        scores[i] = createEl(Score, {key: (i * this.id), username: score.username, score: score.score});
      }
      this.id += 100;
      return (
        dom.div({className: 'scores', scores})
      );
    } else {
      return (
        dom.span({}, 'Nothing')
      );
    }
  }
});

var App = React.createClass({
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
      dom.div({className: 'app unselectable', key: this.props.key},
        dom.div({className: 'main'},
          dom.div({className: 'menu'},
            createEl(LevelSelector, {data: levels, selectedLevel: this.state.level, onLevelSelect: this.handleLevelSelect}),
            createEl(LoginButton, {loggedIn: this.props.server.loggedIn(), onLogin: this.handleLogin, onLogout: this.handleLogout})),
          createEl(MineSweeper, mineSweeperProps)),
        createEl(Highscores, {level: this.state.level, server: this.props.server}))
    );
  }
});

React.render(
  createEl(App, {}),
  document.getElementById('content')
);
