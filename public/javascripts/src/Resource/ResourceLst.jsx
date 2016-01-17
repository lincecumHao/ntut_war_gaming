var React = require('react');
var ResourceItem = require("./ResourceItem.jsx");

var ResourceLst = React.createClass({
  render() {
      return (
          <div>
              <h3> 單位所有資源: </h3>
              <div className='messages'>
                {
                    this.props.resources.map((resource, i) => {
                        return (
                            <ResourceItem
                                key={i}
                                resName={resource.name}
                                resCount={resource.count}
                                minus={this.props.minus}
                                plus={this.props.plus}
                            />
                        );
                    })
                }
              </div>
          </div>
      );
  }
});

module.exports = ResourceLst;  