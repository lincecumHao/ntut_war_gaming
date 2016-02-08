var utils = {

    /**
     *	shourld always private,
     *	handle the total dispatched resource informantion.
     *	應該要是 Private object
     *	主要拿來保存總共派出多少資源
     **/
    _totalDispatched: [],

    /**
     *	init resource object
     *	初始化資源列表
     */
    initResource: function(departs){

    	//formated Resource
    	var formatedDepartAry = this._formateResource(departs);
   	 	
    	//init total dispatched array
    	this._initDispatchedArray(departs);

    	return formatedDepartAry
    },

    /**
     *	init total dispatched array
     **/
    _initDispatchedArray: function(departs){
    	this._totalDispatched = this._createTotalDispatchedObj(departs);
    },

    /**
     *	Fromate resource List, add [send] to zero.
     *	格式化資源列表, 增加 send key, 並使之為零
     *	ex: {"消防車": 12} => {name: "消防車", maxAvailable: 12, send: 0, dispatched: 0}
     **/
    _formateResource: function(departs) {
        var formatedDepart = [];
        for (var i = 0; i < departs.length; i++) {
            formatedDepart.push(this._doFromate(departs[i]));
        }

        return formatedDepart;
    },

    /**
     *	actual do the formate function
     *	實際進行格式化資源列表操作
     */
    _doFromate: function(depart) {
        var resources = depart.Resource;
        var formatedResource = []
        Object.keys(resources).forEach(function(key) {
            formatedResource.push({
                name: key,
                maxAvailable: resources[key],
                dispatched: 0
            });
        });
        depart.Resource = formatedResource;
        return depart;
    },

    /**
     *	create a total dispatched Object.
     *	建立總共已派送資源object.
     *	ex: [{name: "消防車", maxAvailable: 12, send: 0, dispatched: 0}]
     */
    _createTotalDispatchedObj: function(departs) {
        var totalDispatched = [];
        for (var i = 0; i < departs[0].Resource.length; i++) {
            var resource = departs[0].Resource[i];
            resource.dispatched = 0;
            totalDispatched.push(resource);
        }
        return totalDispatched;
    },

    /**
     *	arguments: resource name.
     *	參數: 資源名稱
     *	get specfic resoure current dispatched.
     *	取得目前所有派遣資源
     */
    getTotalDispatchedByResource: function(resource) {
        var dispatchedResource = $.grep(this._totalDispatched, function(e) {
        	return e.name == resource.name;
        })[0];
        return dispatchedResource.dispatched;
    },

    /**
     *	update total dispatched information via all departs.
     *	依據目前departs的state更新所有派送資源
     **/
    updateTotalDispatchedByDeparts: function(departs) {
        var dispatchedResource = this._createTotalDispatchedObj(departs);
        for (var i = 0; i < departs.length; i++) {
            var depart = departs[i];
            // iterator all resource
            depart.Resource.map((resource, id) => {
                if (parseInt(resource.dispatched) > 0) {
                    dispatchedResource.map((dispatchedRes) => {
                        if (dispatchedRes.name == resource.name) {
                            dispatchedRes.dispatched = parseInt(dispatchedRes.dispatched) + parseInt(resource.dispatched);
                            return;
                        }
                    });
                }
            });
        }
        this._totalDispatched = dispatchedResource;
    },
}

module.exports = utils;
