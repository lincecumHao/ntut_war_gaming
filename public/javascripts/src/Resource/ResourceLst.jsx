var React = require('react');
var ResourceItem = require("./ResourceItem.jsx");

var ResourceLst = React.createClass({
  
  handelSubmit: function(e){
    e.preventDefault();
    console.log("submit");
  },

  render: function() {
      return (
          <div>
              <h3> 派出資源: </h3>
              <form className='resource' role='form' onSubmit={this.handelSubmit}>
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
                <button value="send">Send</button>
              </form>
          </div>
      );
  }
});

module.exports = ResourceLst;  