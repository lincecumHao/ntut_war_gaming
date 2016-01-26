var React = require("react");
var SituationApp = require("./Situation/SituationApp.jsx");

//Chatroom 
var MessageList = require("./Chatroom/ChatMsgLst.jsx");
var MessageForm = require("./Chatroom/ChatForm.jsx");
var UserList = require("./Chatroom/UserList.jsx");

//TreeSet
var TreeMenu = require('react-tree-menu').TreeMenu;
var TreeMenuUtils = require('react-tree-menu').Utils;

//SysMsg
var SysMsgs = require("./SysMessage/SysMessages.jsx");

var socket = io();
var _mainMap;
var _eagleMap;
var _eagleMapDefaultZoom = 12;

var Top = React.createClass({

	getInitialState: function() {
		return {
			user: {name:""},
			users: ["all"],
			messages: [],
			sysMessages:[],
			text: '',
			chatTo: undefined,
			departs:[],
			treeData: [],
			situation: {
				step: "",
				description: ""
			},
			systemTime: ""
		};
	},

	componentWillMount: function() {
		this.setState({
			situation:{
				step: "災害發生初期階段",
				description: "臺北盆地因發生隱沒帶之強烈地震，震矩規模7.5，震央位置為中永和地區，本市各行政區震度皆為5級以上，包括本府各機關、重要交通設施、基礎設施、老舊建築物等均受災，由於通訊暫時中斷，一時之間，無法獲知詳細的災情。",
			},
			systemTime: this._getFormatedSystemTime()
		});

		//update system time per second.
		setInterval(function(){ 
			this.setState({
				systemTime: this._getFormatedSystemTime()
			}); 
		}.bind(this), 1000);

		//get user info
		$.get("/currentUser", function(res){
			this.setState({
				user: res.user,
				departs: res.departs
			});
			this.setState({
				treeData: this._formatDeparts(res.departs)
			});
			socket.emit('userLogin', this.state.user);
		}.bind(this));
	},

	componentDidMount: function() {
		setTimeout(this._fakeChangeSituation, 10000);
		this._initMaps();
		socket.on("currentUsers", this._getCurrentUsers)
	  socket.on('send:message', this._messageRecieve);
	  socket.on('user:join', this._userJoined);
	  socket.on('user:left', this._userLeft);
	},

	_formatDeparts: function(departs){
		var formatedAry = [];
		formatedAry.push(this._toTreeFormat(departs[0]));

		var maxLevel = this._getMaxDepartLevel(departs);
		for(var i = 1; i < departs.length; i++){
			formatedAry = this._add2Parent(departs[i], formatedAry);
		}
		return formatedAry;
	},

	_add2Parent: function(depart, array){
		for(var i = 0; i < array.length; i++){
			var parent = array[i];
			if(depart.parent == parent.label){
				array[i].children.push(this._toTreeFormat(depart));
				return array;
			}else if(parent.children.length > 0){
				this._add2Parent(depart, array[i].children);
			}
		}
		return array;
	},

	_getMaxDepartLevel: function(departs){
		var mxLevel = 0;
		for(var i = 0; i < departs.length; i++){
			mxLevel = (departs[i].level > mxLevel ? departs[i].level : mxLevel);
		}
		return mxLevel
	},

	_toTreeFormat: function(depart) {
		return{
			checkbox : (depart.level > 0 ? true : false), 
			label: depart.name,
			children: []
		}
	},

	_initMaps: function(){
		var mapOptions = {
			center: {
	            lat: 25.048644, 
	            lng: 121.533715
	        },
	        zoom: 15
		};
		
		_mainMap = new google.maps.Map(document.getElementById('map'), mapOptions);
		_mainMap.addListener("center_changed", function() {
			_eagleMap.setCenter(_mainMap.getCenter());   
			this._checkBounds();  
		}.bind(this));

		_eagleMap = new google.maps.Map(document.getElementById('eagleMap'), mapOptions);
		_eagleMap.setZoom(_eagleMapDefaultZoom);
		_eagleMap.set("scrollwheel", false);
		_eagleMap.set("draggable", false)
	},

	_checkBounds: function(){
		var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(25.019051, 121.495545), new google.maps.LatLng(25.078147, 121.624291));
		if(! allowedBounds.contains(_mainMap.getCenter())) {
			var C = _mainMap.getCenter();
			var X = C.lng();
			var Y = C.lat();

			var AmaxX = allowedBounds.getNorthEast().lng();
			var AmaxY = allowedBounds.getNorthEast().lat();
			var AminX = allowedBounds.getSouthWest().lng();
			var AminY = allowedBounds.getSouthWest().lat();

			if (X < AminX) {X = AminX;}
			if (X > AmaxX) {X = AmaxX;}
			if (Y < AminY) {Y = AminY;}
			if (Y > AmaxY) {Y = AmaxY;}

			_mainMap.setCenter(new google.maps.LatLng(Y,X));
		}
    },

	_getFormatedSystemTime: function(){
		var date = new Date();
		return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	},
	
	_fakeChangeSituation: function(){
		this.setState({
			situation:{
				step: "災害應變階段",
				description: "現在溫刀火燒厝，請依指示進行處理"
			} 
		});
	},

	_handleDynamicTreeNodePropChange: function (propName, lineage) {
		this.setState(TreeMenuUtils.getNewTreeState(lineage, this.state.treeData, propName));
	},

  _getCurrentUsers: function(data){
  	console.log(data);
    if(data){
        this.setState({
        users: this.state.users.concat(data) 
      });
    }
  },

  _messageRecieve: function(messageObj) {
  	  var stateMsgs = this.state.messages;
      stateMsgs.push(messageObj);
      this.setState({messages: stateMsgs});
  },

  _userJoined: function(username) {
      var currentUsers = this.state.users;
      if(currentUsers.indexOf(username) > -1) {
        return;
      }
      // var currentMessages = this.state.messages;
      // currentUsers.push(username);
      // currentMessages.push({
      //   from : "系統",
      //   text : username +' 已加入'
      // });
      //this.setState({users: currentUsers, messages: currentMessages});
      var currentSysMessages = this.state.sysMessages;
      currentSysMessages.push({text: username + " 已加入系統"});
      this.setState({
      	sysMessages: currentSysMessages
      });
  },

  _userLeft: function(username) {
      // var currentUsers = this.state.users;
      // var currentMessages = this.state.messages;
      // var index = currentUsers.indexOf(username);
      // currentUsers.splice(index, 1);
      // currentMessages.push({
      //   from : "系統",
      //   text : username +' 已離開'
      // });
      // this.setState({users: currentUsers, messages: currentMessages});

      var currentSysMessages = this.state.sysMessages;
      currentSysMessages.push({text: username + " 已離開系統"});
      this.setState({
      	sysMessages: currentSysMessages
      });
  },

  onChatTo: function(username){
    this.setState({
      chatTo: (username == "all" ? undefined : username) 
    });
  },

  handleMessageSubmit: function(message) {
  	socket.emit('send:message', message);
  },

	render: function() {
		return (
			<div className="row full-height">
				<div id="situation_wrapper" className="col-md-10 full-height">
				  <div id="situation" className="row">
				  	<SituationApp
						step={this.state.situation.step}
						description={this.state.situation.description}
						systemTime={this.state.systemTime}
					/>
				  </div>
				  <div className="row custom-content">
				    <div id="departList" className="col-md-2">
				    	<TreeMenu
				    		onTreeNodeCheckChange={this._handleDynamicTreeNodePropChange.bind(this, "checked")} 
				    		onTreeNodeCollapseChange={this._handleDynamicTreeNodePropChange.bind(this, "collapsed")}
				    		expandIconClass="fa fa-chevron-right"
	        			collapseIconClass="fa fa-chevron-down"
					    	data={this.state.treeData} 
				    	/>
				    </div>
				    <div id="wrapper" className="col-md-10">
				      <div id="map" className="map">map</div>
				      <div id="over_map">{
				      	this.state.sysMessages.map((message, i) => {
                    return (
                        <SysMsgs
                            key={i}
                            text={message.text}
                        />
                    	);
               			})
                  }
                </div>
				    </div>
				  </div>
				  <footer className="footer">
				    <div className="container-fluid">
				      <div className="row">
				        <div id="eagleMap" className="col-md-2 eagle-map"></div>
				        <div className="col-md-9">123</div>
				        <div className="col-md-1">
				        	<img src="../images/login.png" />
				        </div>
				      </div>
				    </div>
				  </footer>
				</div>
				<div className="col-md-2 full-height chat">
					<UserList 
		                users={this.state.users}
		                onChatTo={this.onChatTo}
					/>
					<MessageList
						messages={this.state.messages}
	              	/>
					<MessageForm
						onMessageSubmit={this.handleMessageSubmit}
						chatTo={this.state.chatTo}
						from={this.state.user.name}
					/>
				</div>
			</div>
		);
	}
});

module.exports = Top;