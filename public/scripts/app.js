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

var App = React.createClass({
  getInitialState: function() {
    return {
      level: 'S'
    };
  },
  getDefaultProps: function() {
    return {
      key: 1
    };
  },
  getLevelBoard: function(level) {
    if (level == 'S') return SMALL_BOARD;
    if (level == 'M') return MEDIUM_BOARD;
    if (level == 'L') return LARGE_BOARD;
  },
  handleLevelSelect: function(level) {
    if (level == this.state.level) return;
    this.props.key++;
    this.replaceState({level: level});
  },
  render: function() {
    var levels = ['S', 'M', 'L'];
    var levelBoard = this.getLevelBoard(this.state.level);
    var rows = levelBoard.rows;
    var cols = levelBoard.cols;
    var heartLims = levelBoard.heartLims;
    var mineCount = levelBoard.mineCount;
    var mineController = new MineController(rows, cols, heartLims, mineCount);
    var mineSweeperProps = {
      rows: rows,
      cols: cols,
      mineCount: mineCount,
      mineController: mineController
    };
    return (
      <div className="app unselectable" key={this.props.key}>
        <div className="menu">
          <LevelSelector data={levels} selectedLevel={this.state.level} onLevelSelect={this.handleLevelSelect} />
        </div>
        <MineSweeper {...mineSweeperProps}/>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
