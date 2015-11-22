'use strict';

var dom = React.DOM;

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
      dom.tr({className: 'mineRow'}, this.props.cells)
    );
  }
}); 
