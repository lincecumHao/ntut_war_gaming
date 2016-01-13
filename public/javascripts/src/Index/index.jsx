var $ = require("jquery");
var socket = io();
var _map;
$(document).ready(function() {
    _map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
});
