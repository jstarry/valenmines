'use strict';

/**
 * GameStateButton
 *   Represents the button that controls game state.
 *
 * State:
 *   pressed: mouse is down over this button
 *
 * Properties:
 *   gameState: state of the game
 *
 * Callbacks:
 *   onButtonClick: button was clicked
 */

var GameStateButton = React.createClass({

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
    var emojiMap = {
      new: '😊',
      start: '😄',
      won: '😍',
      lost: '😩'
    };
    var emoji = emojiMap[this.props.gameState];
    var classes = React.addons.classSet({
      'gameStateButton': true,
      'pressed': this.state.pressed
    });

    return (
      <div className={classes} onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span>{emoji}</span>
      </div>
    );
  }
});
