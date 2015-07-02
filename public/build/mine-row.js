'use strict';

/**
 * MineRow
 *   Represents a row in the mine grid, it holds many mine cells
 *
 * Properties:
 *   cells: array of mine cells
 */

var MineRow = React.createClass({displayName: "MineRow",
  render: function() {
    return (
      React.createElement("tr", {className: "mineRow"}, 
          this.props.cells
      )
    );
  }
}); 
