// 3D Vector class for convenience

var Vector3 = function(v) {
    // Dimension must be 3
    if (v.length != 3) {
        throw 'Invalid size passed to Vector3'
    }
    this._v = v.slice();

    // Bind the elements as properties

    var makedescr = function(i) {
        return descr = {
            get: function() {
                return this._v[i];
            }, 
            set: function(x) {
                this._v[i] = x;
            }
        };        
    }

    for (var i = 0; i < 3; ++i) {

        var descr = makedescr(i);
        var props = {};
        props[i] = descr;
        props['xyz'[i]] = descr;

        Object.defineProperties(this, props);
    }

}

Vector3.prototype = {

    module: function() {
        return Math.sqrt(this._v[0]*this._v[0]+this._v[1]*this._v[1]+this._v[2]*this._v[2]);
    },

    normalized: function() {
        // Returns
        var l = this.module();
        return new Vector3([this._v[0]/l, this._v[1]/l, this._v[2]/l]);
    },

    normalize: function() {
        // In place version
        this._v = this.normalized()._v;
    }, 

    sum: function(v2) {
        return new Vector3([this._v[0]+v2._v[0],
                            this._v[1]+v2._v[1],
                            this._v[2]+v2._v[2]]);
    },

    dot: function(v2) {
        return this._v[0]*v2._v[0]+this._v[1]*v2._v[1]+this._v[2]*v2._v[2];
    }, 

    cross: function(v2) {
        return new Vector3([this._v[1]*v2._v[2]-this._v[2]*v2._v[1],
                            this._v[2]*v2._v[0]-this._v[0]*v2._v[2],
                            this._v[0]*v2._v[1]-this._v[1]*v2._v[0]]);        
    }, 

    map: function(f) {
        return new Vector3(this._v.map(f));
    }
}

exports.Vector3 = Vector3;