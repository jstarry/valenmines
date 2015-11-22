'use strict';

var dom = React.DOM;
var createEl = React.createElement.bind(React);

/**
 * MineCell
 *   Represents a cell in the mine grid.
 *
 * State:
 *   pressed: mouse is current pressed down on this cell
 *
 * Properties:
 *   row: row index
 *   col: column index
 *   isMine: is a mine
 *   nearbyMines: number of nearby mines
 *   inactive: not part of the playable area
 *   disabled: don't allow interaction
 *   revealed: show value
 *   clicked: show space
 *
 * Callbacks:
 *   onCellClick: tell parent that a click happened
 */

var MineCell = React.createClass({

  getInitialState: function() {
    return {
      pressed: false
    };
  },

  handleMouseEnter: function(e) {
    if (!this.eventsDisabled() && mouseDown) {
      this.setState({pressed: true});
    }
  },
  handleMouseLeave: function(e) {
    if (!this.eventsDisabled() && mouseDown) {
      this.setState({pressed: false});
    }
  },
  handleMouseDown: function(e) {
    if (!this.eventsDisabled() && mouseDown) {
      this.setState({pressed: true});
    }
  },
  handleMouseUp: function(e) {
    if (!this.eventsDisabled()) {
      this.setState({pressed: false});
      this.props.onCellClick(this.props.mine.row, this.props.mine.col);
    }
  },

  isGameOver: function() {
    return this.props.gameState == 'won' || this.props.gameState == 'lost';
  },

  eventsDisabled: function() {
    return this.isGameOver() || this.props.mine.inactive || this.props.mine.revealed;
  },

  renderValue: function() {
    var value = '';
    if (this.props.mine.revealed) {
      if (this.props.mine.isMine) {
        if (this.props.mine.clicked) {
          value = '💔';
        } else {
          value = '💖';
        }
      } else if (this.props.mine.nearbyCount > 0) {
        value = this.props.mine.nearbyMines;
      }
    }
    return value;
  },

  render: function() {
    var nearbyMines = this.props.mine.nearbyMines;
    var classes = React.addons.classSet({
      'mineCell': true,
      'inactive': this.props.mine.inactive,
      'pressed': this.state.pressed,
      'clicked': this.props.mine.clicked,
      'one': nearbyMines == 1,
      'two': nearbyMines == 2,
      'three': nearbyMines == 3,
      'four': nearbyMines == 4,
      'five': nearbyMines == 5,
      'six': nearbyMines == 6,
      'seven': nearbyMines == 7,
      'eight': nearbyMines == 8,
    });

    var cellProps = {
      className: classes,
      onMouseUp: this.handleMouseUp,
      onMouseDown: this.handleMouseDown,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave
    };

    return (
      dom.td(cellProps,
        dom.span({}, this.renderValue()))
    );
  }
});
