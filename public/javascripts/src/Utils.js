var utils = {

    /**
     * transfer deaprts object to tree data format for TreeMenu lib.
     *	把departs轉成tree data給 react-tree-menu lib 使用
     **/
    departsToTreeFormat: function(departs) {
        var formatedAry = [];
        var maxLevel = this._getMaxDepartLevel(departs);

        //append first node
        formatedAry.push(this._toTreeFormat(departs[0], maxLevel));

        for (var i = 1; i < departs.length; i++) {
            formatedAry = this._add2Parent(departs[i], formatedAry, maxLevel);
        }
        return formatedAry;
    },

    /**
     * 	add child depart to parent depart
     *	遞迴, 把所屬單位放到父單位
     **/
    _add2Parent: function(depart, array, maxLevel) {
        for (var i = 0; i < array.length; i++) {
            var parent = array[i];

            //avoid parent name has duration time.
            //當加入抵達時間的時候，要split 避免找不到parent
            var parentName = parent.label.split(" ")[0];
            if (depart.parent == parentName) {
                array[i].children.push(this._toTreeFormat(depart, maxLevel));
                return array;
            } else if (parent.children.length > 0) {
                this._add2Parent(depart, array[i].children, maxLevel);
            }
        }
        return array;
    },

    /**
     * 	get max level of this departs
     **/
    _getMaxDepartLevel: function(departs) {
        var mxLevel = 0;
        for (var i = 0; i < departs.length; i++) {
            mxLevel = (departs[i].level > mxLevel ? departs[i].level : mxLevel);
        }
        return mxLevel
    },

    /**
     *	trans single deaprt to tree data format.
     */
    _toTreeFormat: function(depart, maxLevel) {
        return {
            depart: depart,
            checkbox: (depart.level == maxLevel ? true : false),
            isRadio: true,
            id: depart._id,
            label: depart.name,
            children: []
        }
    }
}

module.exports = utils;
