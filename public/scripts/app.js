var LevelButton = React.createClass({
  getInitialState: function() {
    return {pressed: this.props.initialPressed};
  },
  handleOnClick: function() {
    this.props.onSelect(this.props.level);
  },
  render: function() {
    return (
      <div className="levelButton" onClick={this.handleOnClick}>
        {this.props.level}
      </div>
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
      levelButtons[i] = <LevelButton key={i} level={data[i]} initialPressed={selected} onSelect={this.handleOnSelect} />;
    }
    return (
      <div className="levelSelector">
        {levelButtons}
      </div>
    );
  },
});

var LoginButton = React.createClass({
  render: function() {
    if (this.props.loggedIn) {
      return (
        <button className="twitter" onClick={this.props.onLogout}>
          Sign out
        </button>
      );
    } else {
      return (
        <button className="twitter" onClick={this.props.onLogin}>
          Sign in
        </button>
      );
    }
  }
});

var Score = React.createClass({
  render: function() {
    return (
      <div className="score">
        <span className="username">{this.props.username}</span>
        <span className="score">{this.props.score}</span>
      </div>
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
        score = highscores[i];
        scores[i] = <Score key={i * this.id} username={score.username} score={score.score}/>;
      }
      this.id += 100;
      return (
        <div className="scores">
          {scores}
        </div>
      );
    } else {
      return (
        <span>Nothing</span>
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
      <div className="app unselectable" key={this.props.key}>
        <div className="main">
          <div className="menu">
            <LevelSelector data={levels} selectedLevel={this.state.level} onLevelSelect={this.handleLevelSelect} />
            <LoginButton loggedIn={this.props.server.loggedIn()} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
          </div>
          <MineSweeper {...mineSweeperProps}/>
        </div>
        <Highscores level={this.state.level} server={this.props.server}/>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
