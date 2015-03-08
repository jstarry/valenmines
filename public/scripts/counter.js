'use strict';

/**
 * Counter
 *   Represents a cell in the mine grid.
 *
 * Properties:
 *   count: current count
 */

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
