var $ = require("jquery");
var React = require('react');
var ChatApp = require('../ChatRoom/Chat.jsx');
var socket = io();
var _map;
var index = React.createClass({

	getInitialState: function() {
		return {
			user: {name:""},
			userDepart: {} 
		};
	},

	componentWillMount: function() {
		$.get("/currentUser", function(res){
			this.setState({
				user: res.user,
				userDepart: res.depart
			});
			socket.emit('userLogin', this.state.user);
			this.initMap();
		}.bind(this));
	},

	componentDidMount: function() {
		
	},

	initMap: function(){
		_map = new google.maps.Map(document.getElementById('map'), {
	        center: {
	            lat: 25.048644, 
	            lng: 121.533715
	        },
	        zoom: 12
    	});
		userDepartLatLng = this.addr2LatLng(this.state.userDepart.address, function(loc){this.addMarker(loc, this.state.userDepart.name);}.bind(this));
	},

	addMarker: function(latlng, title){
		new google.maps.Marker({
			position: latlng,
			map: _map,
			title: title
		});
	},

	addr2LatLng: function(addr, callback){
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({ address: addr }, function (results, status) {
            //檢查執行結果
            if (status == google.maps.GeocoderStatus.OK) {
                var loc = results[0].geometry.location;
                callback(loc);
            }
            else
            {
				console.log("can't convert addr 2 latlng");
            }
        }.bind(this));
	},

	render: function() {
	      return (
	          	<div className='row full-height'>
	          		<div id="resource" className="col-md-2 full-height">
	          		</div>
	          		<div id="map" className="col-md-8 full-height">
	          		</div>
	          		<div id="chat-room" className="col-md-2 full-height">
	          			<ChatApp 
	          				self={this.state.user}
	          				socket={socket}
	          			/>
	          		</div>
	          	</div>
	      );
	  }
});

module.exports = index; 