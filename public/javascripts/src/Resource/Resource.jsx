var React = require('react');
var $ =require("jquery");
var ResourceLst = require("./ResourceLst.jsx");

var ResourceApp = React.createClass({
  getInitialState: function() {
    return {
      resources: [],
      rendResources: []
    };
  },
  componentWillMount: function() {
    this.setState({
      resources: this.props.resources; 
    });
  },

  getArrayIndex: function(resName){
    for(index in this.state.resources){
      if(this.state.resources[index].name == resName){
        return index;
      }
    }
    return -1;
  },

  minus: function(resName){
    var currentCount = (this.state.sendResource[resName] ? this.state.sendResource[resName] : 0);
    if(currentCount + 1 <= maxCount){
      this.setState({
        resName: currentCount + 1; 
      });
    }
  },

  plus: function(resName) {
    var maxCount = this.state.resources[getArrayIndex(resName)].count;
    var currentCount = (this.state.sendResource[resName] ? this.state.sendResource[resName] : 0);
    if(currentCount + 1 <= maxCount){
      this.setState({
        resName: currentCount + 1; 
      });
    }
  },
  
  render: function(){
    <div className="resource">
      <h3> 單位剩餘資源: </h3>
      {
        this.state.resources.map((resource, i) => {
            return (
                <div>
                  <p> {resource.name} : {resource.count} </p>
                </div>
            );
        })
      }
      <ResourceLst />
    </div>
  }
});

module.exports = ResourceApp; 