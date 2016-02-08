var React = require('react');
var MessageList = require("./ChatMsgLst.jsx");
var MessageForm = require("./ChatForm.jsx");
var UserList = require("./UserList.jsx");
var $ = require("jquery");

var ChatApp = React.createClass({

	getInitialState: function() {
		return {
			socket: null,
			users: [
				"all"
			], 
			messages:[], 
			chatTo: undefined
		};
	},

	componentDidMount: function() {
		this.state.socket = io();
		this.state.socket.on("currentUsers", this._addCurrentUserInSystem)
		this.state.socket.on('send:message', this._messageRecieve);
		this.state.socket.on('user:join', this._userJoined);
		this.state.socket.on('user:left', this._userLeft);
	},

	componentWillReceiveProps: function(nextProps) {
		//如果 user != 前一次 user 表示 ajax 取得資料
		if(nextProps.self != this.props.self){

			//socket a userlogin event.
			this.state.socket.emit('userLogin', nextProps.self);
		}
	},

	/**
	 *	add current user in the system if have any.
	 *	加入系統目前使用者
	 **/
	_addCurrentUserInSystem: function(data){
		if(data){
			this.setState({
				users: this.state.users.concat(data) 
			});
		}
	},

	/**
	 *	when chat room recive a new message.
	 * 	收到訊息時
	 */
	_messageRecieve: function(messageObj) {
		var stateMsgs = this.state.messages;
		stateMsgs.push(messageObj);
		this.setState({messages: stateMsgs});
	},

	/**
	 *	when a user join the system, add a message in system message window.
	 *	當有使用者加入系統，增加一個文字在system message 視窗
	 **/
	_userJoined: function(username) {
		var currentUsers = this.state.users;
		if(currentUsers.indexOf(username) > -1) {
			return;
		}else{
			currentUsers.push(username);
			this.setState({
				users: currentUsers 
			});
		}

		

		var notifyMsg = username + " 已加入系統";
		this.props.systemNotify(notifyMsg);
	},

	/**
	 * 	when a user left the system, add a message in system message window.
	 * 	當使用者離開系統，增加一個文字在system message 視窗
	 **/
	_userLeft: function(username) {
		var currentUsers = $.grep(this.state.users, function(user){
			return user != username
		});

		this.setState({
			users: currentUsers 
		});	
		
		var notifyMsg = username + " 已離開系統";
		this.props.systemNotify(notifyMsg);
	},

	/**
	 * 	when user choose another user in the userlist, the message form will show who is chat to
	 * 	當使用者選另外一個在使用者列表的時候，form inpu 會顯示跟誰對話
	 **/
	_onChatTo: function(username){
		this.setState({
			chatTo: (username == "all" ? undefined : username) 
		});
	},

	/**
	 * 	submit message.
	 * 	發送訊息
	 **/
	_handleMessageSubmit: function(message) {
		this.state.socket.emit('send:message', message);
	},

	render: function() {
			return (
				<div className="col-md-2 full-height chat">
					<UserList 
						users={this.state.users}
						onChatTo={this._onChatTo}
					 />
					<MessageList
						messages={this.state.messages}
					/>
					<MessageForm
						onMessageSubmit={this._handleMessageSubmit}
						chatTo={this.state.chatTo}
						from={this.props.self.name}
					/>
				</div>
			);
	}
});

module.exports = ChatApp; 