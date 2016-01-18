var React = require('react');
var ResourceItem = require("./ResourceItem.jsx");

var ResourceLst = React.createClass({
  render() {
      return (
          <div>
              <h3> 派出資源: </h3>
              <form className='messages'>
                {
                    this.props.resources.map((resource, i) => {
                        return (
                            <ResourceItem
                                key={i}
                                resName={resource.name}
                                minus={this.props.minus}
                                plus={this.props.plus}
                            />
                        );
                    })
                }
                <button value="send">Send</button>
              </form>
          </div>
      );
  }
});

module.exports = ResourceLst;  