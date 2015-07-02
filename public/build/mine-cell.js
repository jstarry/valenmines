'use strict';

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

var MineCell = React.createClass({displayName: "MineCell",

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
      this.props.onCellClick(this.props.row, this.props.col);
    }
  },

  eventsDisabled: function() {
    return this.props.inactive || this.props.disabled || this.props.clicked;
  },

  renderValue: function() {
    var value = '';
    if (this.props.revealed) {
      if (this.props.isMine) {
        if (this.props.clicked) {
          value = '💔';
        } else {
          value = '💖';
        }
      } else if (this.props.nearbyMines > 0) {
        value = this.props.nearbyMines;
      }
    }
    return value;
  },

  render: function() {
    var classes = React.addons.classSet({
      'mineCell': true,
      'inactive': this.props.inactive,
      'pressed': this.state.pressed,
      'clicked': this.props.clicked,
      'revealed': this.props.revealed,
      'one': this.props.nearbyMines == 1,
      'two': this.props.nearbyMines == 2,
      'three': this.props.nearbyMines == 3,
      'four': this.props.nearbyMines == 4,
      'five': this.props.nearbyMines == 5,
      'six': this.props.nearbyMines == 6,
      'seven': this.props.nearbyMines == 7,
      'eight': this.props.nearbyMines == 8,
    });

    return (
      React.createElement("td", {className: classes, onMouseUp: this.handleMouseUp, onMouseDown: this.handleMouseDown, 
            onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave}, 
        React.createElement("span", null, this.renderValue())
      )
    );
  }
});
