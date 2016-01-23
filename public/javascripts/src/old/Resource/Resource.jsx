var React = require('react');
var $ =require("jquery");
var ResourceLst = require("./ResourceLst.jsx");

var ResourceApp = React.createClass({

  getInitialState: function() {
    return {
      resources: [],
      sendResources: []
    };
  },

  componentDidMount: function() {

    $.get("/currentUser", function(res){
      this.setState({
        resources: res.depart.resource
      });
      var sendResources = [];
      for(var i = 0; i < this.state.resources.length; i++){
        var resource = this.state.resources[i];
        sendResources.push({
          name: resource.name,
          count: 0
        });
      }
      this.setState({
        sendResources: sendResources
      });
    }.bind(this));
  },

  getArrayIndex: function(resName, ary){
    for(index in this.state.resources){
      if(this.state.resources[index].name == resName){
        return index;
      }
    }
    return -1;
  },

  sendResource: function(e){
    e.preventDefault();
    var data = {
      res: this.state.sendResources
    }
    $.post( "/sendRes", data);
  },

  editSendCount: function(resName, value){
    var modifyObjIndex = this.getArrayIndex(resName, this.state.sendResources);
    var currentCout = this.state.sendResources[modifyObjIndex].count;
    var maxCount = this.state.resources[this.getArrayIndex(resName, this.state.resources)].count;
    if(currentCout + value <= maxCount && currentCout + value >= 0){
      var ary = this.state.sendResources;
      ary[modifyObjIndex] = {
        name: resName,
        count: currentCout + value
      }
      this.setState({
        sendResources: ary 
      });
    }
  },

  render: function(){
    return(
      <div className="resource">
        <h3> 單位總資源: </h3>
        {
          this.props.resources.map((resource, i) => {
              return (
                  <div key={i}>
                    <p> {resource.name} : {resource.count} </p>
                  </div>
              );
          })
        }
        <ResourceLst 
          resources={this.state.sendResources}
          edit={this.editSendCount}
          sumbit={this.sendResource}
        />
      </div>
    );
  }
});

module.exports = ResourceApp; 