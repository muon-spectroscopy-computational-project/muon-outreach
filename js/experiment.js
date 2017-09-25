/*** Utility functions for dealing with vectors ***/

function mod(v) {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
}

function normalise(v) {
    var l = mod(v);
    return [v[0]/l, v[1]/l, v[2]/l];
}

function sum(v1, v2) {
    return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
}

function dot(v1, v2) {
    return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
}

function cross(v1, v2) {
    return [v1[1]*v2[2]-v1[2]*v2[1],
            v1[2]*v2[0]-v1[0]*v2[2],
            v1[0]*v2[1]-v1[1]*v2[0]];
}

/******/

exports.muonExperiment = function(n, dynModel) {

    this.n = n;
    this.dyn = dynModel;

    // Initialise spins and fields
    this.spins = [];
    this.Bs = [];
    for (var i = 0; i < this.n; ++i) {
        this.spins.push([0, 0, 1]); // By default, polarization along z
        this.Bs.push(new dynModel());
    }
}

exports.muonExperiment.prototype = {

    step: function() {
        // Advance the system by one step
        self = this;
        this.spins = this.spins.map(function(s, i) {
            var ds = cross(s, self.Bs[i].next());
            return normalise(sum(s, ds));
        });
    },

    // Transverse polarisation
    Pxy: function() {
        S = this.spins.reduce(function(p, s) {
            return [p[0]+s[0], p[1]+s[1]];
        }, [0, 0]);
        return Math.sqrt(S[0]*S[0]+S[1]*S[1])/this.n;
    }, 

    Px: function() {
        return this.spins.reduce(function(p, s) {
            return p+s[0];
        }, 0)/this.n;
    },

    Py: function() {
        return this.spins.reduce(function(p, s) {
            return p+s[1];
        }, 0)/this.n;
    },

    // Longitudinal polarisation
    Pz: function() {
        return this.spins.reduce(function(p, s) {
            return p+s[2];
        }, 0)/this.n;
    }

}