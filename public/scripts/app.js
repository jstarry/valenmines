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
      <div className="app unselectable">
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
