'use strict';

// Document event handlers
var mouseDown = false;
document.body.onmousedown = function(e) {
  if (!e.ctrlKey) {
    mouseDown = true;
  }
}
document.body.onmouseup = function() {
  mouseDown = false;
}

// DATA
var LARGE_BOARD = {
  mineCount: 110,
  rows: 30,
  cols: 31,
  heartLims: [
    [5, 10],
    [4, 11],
    [3, 12],
    [2, 13],
    [2, 13],
    [1, 14],
    [1, 14],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [6, 15],
    [7, 15],
    [8, 15],
    [9, 15],
    [10, 15],
    [11, 15],
    [12, 15],
    [13, 15],
    [14, 15],
    [15, 15]]
};

var MEDIUM_BOARD = {
  mineCount: 50,
  rows: 20,
  cols: 21,
  heartLims: [
    [3, 7],
    [2, 8],
    [1, 9],
    [1, 9],
    [0, 10],
    [0, 10],
    [0, 10],
    [0, 10],
    [0, 10],
    [1, 10],
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10]]
};

var SMALL_BOARD = {
  mineCount: 12,
  rows: 10,
  cols: 11,
  heartLims: [
    [2, 3],
    [1, 4],
    [0, 5],
    [0, 5],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5]]
};

// Utilities
function getRandomInt(max) {
    return Math.floor(max * Math.random());
};

function getRandomPermutation(n) {
  var array = new Array(n);
  for (var i = 0; i < n; i++) {
    array[i] = i;
  }

  for (var i = 0; i < n; i++) {
    var j = getRandomInt(n);
    var swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  };
  return array;
};

var Counter = React.createClass({
  render: function() {
    var value = '' + Math.min(this.props.count, 999);
    while (value.length < 3) {
      value = '0' + value;
    }
    return (
      <div className="counter">
        <span>
           {value}
        </span>
      </div>
    );
  }
});

var MineButton = React.createClass({
  getInitialState: function() {
    return {
      pressed: false
    };
  },
  handleMouseEnter: function(e) {
    if (mouseDown) {
      this.setState({pressed: true});
    }
  },
  handleMouseLeave: function(e) {
    if (mouseDown) {
      this.setState({pressed: false});
    }
  },
  handleMouseDown: function(e) {
    if (mouseDown) {
      this.setState({pressed: true});
    }
  },
  handleMouseUp: function(e) {
      this.props.onButtonClick();
      this.setState({pressed: false});
  },
  render: function() {
    var imgSources = {
      new: '😊',
      start: '😄',
      won: '😍',
      lost: '😩'
    };
    var imgSrc = imgSources[this.props.gameState];
    var cx = React.addons.classSet;
    var classes = cx({
      'mineButton': true,
      'pressed': this.state.pressed,
      'unselectable': true
    });
    return (
      <div className={classes} onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span>{imgSrc}</span>
      </div>
    );
  }
});

var MineSweeper = React.createClass({

  getInitialState: function() {
    return {
      mines: this.newMines(),
      gameState: 'new',
      spaces: 0,
      seconds: 0
    };
  },

  handleMineClick: function() {
    this.handleGameLost();
  },

  handleRevealSpaces: function(spaces) {
    if (spaces == this.state.spaces) {
      this.handleGameWon();
    }
    this.setState({spaces: this.state.spaces - spaces});
  },

  handleGameStart: function(cb) {
    var that = this;
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineCount = this.props.mineCount;
    var inactiveCount = this.inactiveCount();
    this.setState({
      gameState: 'start',
      spaces: rows * cols - mineCount - inactiveCount
    }, function() {
      that.interval = setInterval(function() {
        that.setState({seconds: that.state.seconds + 1});
      }, 1000);
      cb();
    });
  },

  handleGameLost: function() {
    clearInterval(this.interval);
    this.setState({gameState: 'lost'});
  },

  handleGameWon:  function() {
    clearInterval(this.interval);
    this.setState({gameState: 'won'});
  },

  inactiveCount: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mines = this.state.mines;
    var inactiveCount = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (mines[r][c].inactive) {
          inactiveCount++;
        }
      }
    }
    return inactiveCount;
  },

  newMines: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var heartLims = this.props.heartLims;
    var mines = new Array(rows);
    for (var r = 0; r < rows; r++) {
      mines[r] = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var inactive = false;
        if (heartLims[r]) {
          var leftLim = heartLims[r][0];
          var rightLim = heartLims[r][1];
          inactive = c < leftLim || c > rows - leftLim;
          inactive = inactive || (c > rightLim && c < rows - rightLim);
        }
        mines[r][c] = {
          nearbyMines: 0,
          revealed: false,
          inactive: inactive,
          isMine: false
        };
      }
    }
    return mines;
  },

  handleButtonClick: function() {
    clearInterval(this.interval);
    this.replaceState(this.getInitialState());
  },

  isGameStarted: function() {
    return this.state.spaces != 0;
  },

  render: function() {
    var gridProps = {
      rows: this.props.rows,
      cols: this.props.cols,
      mines: this.state.mines,
      mineCount: this.props.mineCount,
      gameState: this.state.gameState
    };
    var gridCallbacks = {
      isGameStarted: this.isGameStarted,
      onGameStart: this.handleGameStart,
      onRevealSpaces: this.handleRevealSpaces,
      onMineClick: this.handleMineClick
    };
    return (
      <div className="mineBoard unselectable">
        <div className="mineStatusBar">
          <Counter count={this.state.spaces} />
          <MineButton gameState={this.state.gameState} onButtonClick={this.handleButtonClick} />
          <Counter count={this.state.seconds} />
        </div>
        <MineGrid ref="mineGrid" {...gridProps} {...gridCallbacks} />
      </div>
    );
  }
});

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
  getInitialState: function() {
    return {level: this.props.initialLevel};
  },
  handleOnSelect: function(level) {
    this.props.onLevelSelect(level);
  },
  render: function() {
    var data = this.props.data;
    var numLevels = data.length;
    var levelButtons = new Array(numLevels);
    for (var i = 0; i < numLevels; i++) {
      var selected = data[i] == this.state.level;
      levelButtons[i] = <LevelButton key={i} level={data[i]} initialPressed={selected} onSelect={this.handleOnSelect} />;
    }
    return (
      <div className="levelSelector">
        {levelButtons}
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState: function() {
    return {
      level: 'S'
    };
  },
  getLevelBoard: function(level) {
    if (level == 'S') return SMALL_BOARD;
    if (level == 'M') return MEDIUM_BOARD;
    if (level == 'L') return LARGE_BOARD;
  },
  handleLevelSelect: function(level) {
    this.setState({level: level});
  },
  render: function() {
    var levels = ['S', 'M', 'L'];
    var levelBoard = this.getLevelBoard(this.state.level);
    return (
      <div className="app">
        <div className="menu">
          <LevelSelector data={levels} initialLevel={this.state.level} onLevelSelect={this.handleLevelSelect} />
        </div>
        <MineSweeper {...levelBoard}/>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
