'use strict';

/**
 * Counter
 *   Represents a cell in the mine grid.
 *
 * Properties:
 *   count: current count
 */

var Counter = React.createClass({displayName: "Counter",
  render: function() {
    var value = '' + Math.min(this.props.count, 999);
    while (value.length < 3) {
      value = '0' + value;
    }
    return (
      React.createElement("div", {className: "counter"}, 
        React.createElement("span", null, 
           value
        )
      )
    );
  }
});
