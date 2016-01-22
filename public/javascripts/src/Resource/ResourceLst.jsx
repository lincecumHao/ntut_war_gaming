var React = require('react');
var ResourceItem = require("./ResourceItem.jsx");

var ResourceLst = React.createClass({
  
  render: function() {
      return (
          <div>
              <h3> 派出資源: </h3>
              <form className='resource' role='form' onSubmit={this.props.submit}>
                {
                    this.props.resources.map((resource, i) => {
                        return (
                            <ResourceItem
                                key={i}
                                resName={resource.name}
                                resCount={resource.count}
                                edit={this.props.edit}
                            />
                        );
                    })
                }
                <button value="send" onClick={this.props.sumbit} className="btn btn-success">送出</button>
              </form>
          </div>
      );
  }
});

module.exports = ResourceLst;  