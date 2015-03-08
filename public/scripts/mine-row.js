'use strict';

/**
 * MineRow
 *   Represents a row in the mine grid, it holds many mine cells
 *
 * Properties:
 *   cells: array of mine cells
 */

var MineRow = React.createClass({
  render: function() {
    return (
      <tr className="mineRow">
          {this.props.cells}
      </tr>
    );
  }
}); 
