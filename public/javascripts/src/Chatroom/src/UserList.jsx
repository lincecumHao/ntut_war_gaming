var React = require('react');
var User = require('./User.jsx');

var UsersList = React.createClass({
  render: function() {
      return (
          <div className="row login-user">
              <h3> 目前使用者 </h3>
                  {
                      this.props.users.map((user, i) => {
                          return (
                              <User 
                              	key={i}
                              	user={user}
                               	onChatTo={this.props.onChatTo}/>
                          );
                      })
                  }             
          </div>
      );
  }
});

module.exports = UsersList;  