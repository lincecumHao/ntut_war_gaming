var React = require('react');

var SysMsg = React.createClass({
  render() {
      return (
          <div>
          	<p>
          		{this.props.text}
          	</p>
          </div>
      );
  }
});

module.exports = SysMsg;  