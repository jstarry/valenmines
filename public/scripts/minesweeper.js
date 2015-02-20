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

// Utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// React Components
var MineNode = React.createClass({
  getInitialState: function() {
    return {
      pressed: false
    };
  },
  handleMouseEnter: function(e) {
    if (mouseDown && !this.props.showSpace && !this.props.disabled) {
      this.setState({pressed: true});
    }
  },
  handleMouseLeave: function(e) {
    if (mouseDown && !this.props.showSpace) {
      this.setState({pressed: false});
    }
  },
  handleMouseDown: function(e) {
    if (mouseDown && !this.props.showSpace && !this.props.disabled) {
      this.setState({pressed: true});
    }
  },
  handleMouseUp: function(e) {
    if (!this.props.showSpace && !this.props.disabled) {
      this.setState({pressed: false});
      this.props.onMineClick(this.props.row, this.props.col);
    }
  },
  getDefaultProps: function() {
    return {
      active: true,
      nearbyMines: 0,
      isMine: false,
      showSpace: false,
      showValue: false
    };
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'mineNode': true,
      'pressed': this.state.pressed,
      'showSpace': this.props.showSpace,
      'showValue': this.props.showValue,
      'active': this.props.active,
      'one': this.props.nearbyMines == 1,
      'two': this.props.nearbyMines == 2,
      'three': this.props.nearbyMines == 3,
      'four': this.props.nearbyMines == 4,
      'five': this.props.nearbyMines == 5,
      'six': this.props.nearbyMines == 6,
      'seven': this.props.nearbyMines == 7,
      'eight': this.props.nearbyMines == 8,
    });
    var value = '';
    if (this.props.showValue && this.props.active) {
      if (this.props.isMine) {
        if (this.props.showSpace) {
          value = '💔';
        } else {
          value = '💖';
        }
      } else if (this.props.nearbyMines > 0) {
        value = this.props.nearbyMines;
      }
    }
    return (
      <td className={classes} onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span>{value}</span>
      </td>
    );
  }
});

var MineRow = React.createClass({
  render: function() {
    return (
      <tr className="mineRow">
          {this.props.nodes}
      </tr>
    );
  }
}); 

var MineGrid = React.createClass({
  getInitialState: function() {
    return {
      gameStarted: false,
    }
  },

  populate: function(row, col) {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var minesLeft = this.props.mineCount;
    while (minesLeft > 0) {
      var randomRow = getRandomInt(0, rows);
      var randomCol = getRandomInt(0, cols);
      if ((randomRow < row - 1 || randomRow > row + 1) || (randomCol < col - 1 || randomCol > col + 1)) {
        var randomMine = this.props.mines[randomRow][randomCol];
        if (!randomMine.isMine && randomMine.active) {
          randomMine.isMine = true;
          minesLeft--;
          continue;
        }
      }
    }
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (this.props.mines[r][c].isMine) {
          for (var r1 = Math.max(0, r - 1); r1 < Math.min(rows, r + 2); r1++) {
            for (var c1 = Math.max(0, c - 1); c1 < Math.min(cols, c + 2); c1++) {
              if (!(r1 == r && c1 == c)) {
                this.props.mines[r1][c1].nearbyMines++;
              }
            }
          }
        }
      }
    }
  },

  revealSpaces: function(row, col) {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mines = this.props.mines;
    var mine = mines[row][col];
    if (mine.revealed) return 0;
    if (mine.isMine) {
      return -1;
    } else {
      var spacesRevealed = 1;
      mine.revealed = true;
      if (mine.nearbyMines == 0) {
        for (var r1 = Math.max(0, row - 1); r1 < Math.min(rows, row + 2); r1++) {
          for (var c1 = Math.max(0, col - 1); c1 < Math.min(cols, col + 2); c1++) {
            if (!(r1 == row && c1 == col)) {
              spacesRevealed += this.revealSpaces(r1, c1);
            }
          }
        }
      }
      return spacesRevealed;
    }
  },
  inactiveCount: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mines = this.props.mines;
    var spacesRevealed = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var mine = mines[r][c];
        if (!mine.active) {
          spacesRevealed ++;
        }
      }
    }
    return spacesRevealed;
  },
  handleMineClick: function(row, col) {
    var spacesRevealed = 0;
    if (!this.props.isGameStarted()) {
      this.populate(row, col);
      var that = this;
      this.props.onGameStart(function() {
        spacesRevealed = that.inactiveCount();
        spacesRevealed += that.revealSpaces(row, col);
        that.props.onRevealSpaces(spacesRevealed);
        that.forceUpdate();
      });
    } else {
      spacesRevealed += this.revealSpaces(row, col);
      this.props.onRevealSpaces(spacesRevealed);
      this.forceUpdate();
    }
  },
  render: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineRows = new Array(rows);
    var disabled = this.props.gameState == 'won' || this.props.gameState == 'lost';
    for (var r = 0; r < rows; r++) {
      var mineCols = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var mine = this.props.mines[r][c];
        var data = {
          key: c,
          disabled: disabled,
          isMine: mine.isMine,
          active: mine.active,
          nearbyMines: mine.nearbyMines,
          showValue: (mine.isMine && (this.props.gameState == 'won' || this.props.gameState == 'lost')) || mine.revealed,
          showSpace: (mine.isMine && this.props.gameState == 'lost') || mine.revealed
        }
        mineCols[c] = <MineNode {...data} row={r} col={c} onMineClick={this.handleMineClick} />;
      }
      mineRows[r] = <MineRow key={r} nodes={mineCols} />
    }
    return (
      <table className="mineGrid unselectable">
        <tbody>
          {mineRows}
        </tbody>
      </table>
    );
  }
});

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

var LARGE_BOARD = {
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
}
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
}

var MineSweeper = React.createClass({
  getInitialState: function() {
    return {
      mines: this.newMines(),
      gameState: 'new',
      spaces: 0,
      seconds: 0
    };
  },
  handleRevealSpaces: function(spaces) {
    if (spaces < 0) {
      this.handleGameLost();
    } else {
      if (spaces == this.state.spaces) {
        this.handleGameWon();
      }
      this.setState({spaces: this.state.spaces - spaces});
    }
  },
  handleGameStart: function(cb) {
    var that = this;
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineCount = this.props.mineCount;
    this.setState({
      gameState: 'start',
      spaces: rows * cols - mineCount
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
          revealed: inactive,
          active: !inactive,
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
    return (
      <div className="mineBoard">
        <div className="mineStatusBar">
          <Counter count={this.state.spaces} />
          <MineButton gameState={this.state.gameState} onButtonClick={this.handleButtonClick} />
          <Counter count={this.state.seconds} />
        </div>
        <MineGrid ref="mineGrid" isGameStarted={this.isGameStarted} {...this.props} mines={this.state.mines} gameState={this.state.gameState} onGameStart={this.handleGameStart} onRevealSpaces={this.handleRevealSpaces} />
      </div>
    );
  }
});

React.render(
  <MineSweeper {...LARGE_BOARD}/>,
  document.getElementById('content')
);
