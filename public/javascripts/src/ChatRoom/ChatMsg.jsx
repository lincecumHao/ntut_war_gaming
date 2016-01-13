var React = require('react');

var ChatMsg = React.createClass({
  render() {
      return (
          <div className="message">
              <strong>who :</strong> 
              <span>{this.props.text}</span>        
          </div>
      );
  }
});

module.exports = ChatMsg;  