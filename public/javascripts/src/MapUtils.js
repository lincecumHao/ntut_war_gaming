var mapUtils = {

    _mainMap: {},

    _eagleMap: {},

    _processBarOverlayView: {},

    _minZoomLevel: 13,

    _eagleMapDefaultZoom: 10,

    initMainMap: function() {
        var mapOptions = {
            center: {
                lat: 25.048644,
                lng: 121.533715
            },
            zoom: this._minZoomLevel
        };

        this._mainMap = new google.maps.Map(document.getElementById('map'), mapOptions);
        console.log(this._mainMap);

        //only for call fromLatLngToContainerPixel, ugly but indeed
        this._processBarOverlayView = new google.maps.OverlayView();
        this._processBarOverlayView.draw = function() {};
        this._processBarOverlayView.setMap(this._mainMap);

        var eagleRectangle = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 2,
            bounds: _mainMap.getBounds()
        });

        _mainMap.addListener("center_changed", function(e) {
            //_eagleMap.setCenter(_mainMap.getCenter()); 
            this._checkBounds();
            if (this.state.disasterMarker != null) {
                var point2 = _overlay.getProjection().fromLatLngToContainerPixel(this.state.disasterMarker.getPosition());
                var info = document.getElementById("processBar");
                this.setState({
                    processBarStyle: {
                        left: (point2.x - 50) + "px",
                        top: (point2.y - 70) + "px",
                        display: "block"
                    }
                });
            }
            eagleRectangle.setBounds(_mainMap.getBounds());
        }.bind(this));

        // Limit the zoom level
        _mainMap.addListener("zoom_changed", function(e) {
            if (_mainMap.getZoom() < minZoomLevel) _mainMap.setZoom(minZoomLevel);
        });

        _eagleMap = new google.maps.Map(document.getElementById('eagleMap'), mapOptions);
        _eagleMap.setZoom(_eagleMapDefaultZoom);
        _eagleMap.set("scrollwheel", false);
        _eagleMap.set("draggable", false);
        eagleRectangle.setMap(_eagleMap);

    },

    initEagleMap: function(){

    }(),

}

module.exports = mapUtils;
