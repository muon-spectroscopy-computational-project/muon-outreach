// Models that can be plotted/visualised in the final window
var DysonFID = require('./dyson.js').DysonFID;
var Distributions = require('./distributions.js');

var ArgDef = function(name, type, fullname, description, fixed, def_value, min, max) {
    this.name = name;
    this.type = type;
    this.fullname = fullname;
    this.description = description;
    this.fixed = fixed || false;
    this._default = def_value;

    if (type == 'float') {
        this.min = min || (this._default || 0);
        this.max = max || (this._default || 1);
    }
}

ArgDef.prototype = {

    default: function() {
        if (this._default != null) {
            return this._default;
        }
        else {
            if (this.type == 'bool') {
                return false;
            }
            else if (this.type == 'float') {
                return this.min;
            }            
        }
        return null;
    }
}

var Model = function(distribution, D, n, dt, tsteps, args, minD, maxD, minNu, maxNu, 
                     mininvT1, maxinvT1) {
    this.D = D || 1.0; // Distribution spread parameter
    this.n = n || 36; // Default number of points
    this.distrF = distribution;
    this.dt = dt || 0.01;
    this.tsteps = tsteps || 150;
    this.nu = 0;
    this.invT1 = 0;
    this.args = args || [];
    this.arg_vals = args.map(function(a) { return a.default(); });

    this.minD = minD || 5.0;
    this.maxD = maxD || 15.0;
    this.minNu = minNu || 0.0;
    this.maxNu = maxNu || 100.0;
    this.mininvT1 = mininvT1 || 0.0;
    this.maxinvT1 = maxinvT1 || 5.0;
}

Model.prototype = {

    update: function() {
        this.t = [0.0];
        this.fid = [1.0];

        distr = this.distrF.apply(null, [this.D, this.n].concat(this.arg_vals));
        var dfid = new DysonFID(distr.freqs, this.dt, this.nu, distr.weights);

        for (var i = 0; i < this.tsteps; ++i) {
            dfid.step();
            this.t.push(dfid.t);
            this.fid.push(dfid.FID*Math.exp(-this.invT1*dfid.t));
        }
    }
}

exports.UniaxialGaussianModel = function() {
    Model.call(this, Distributions.UniaxialGaussian, 
                                          5.0, 36, 0.01, 150,
                                          []);
}
exports.UniaxialGaussianModel.prototype = Object.create(Model.prototype);
exports.UniaxialGaussianModel.fullname = "Gaussian distribution (along z axis)";

exports.SphericalGaussianModel = function() {
    Model.call(this, Distributions.SphericalGaussian, 
                     5.0, 36, 0.01, 150,
                     [new ArgDef('B_external', 'float',
                                 'External magnetic field', 
                                 'External field applied to the sample',
                                 false,
                                 0.0,
                                 0.0, 30.0),
                      new ArgDef('is_transverse', 'bool',
                                 'Use transverse setup', 
                                 'If checked, the external field is applied in a direction transverse to the magnetization')]);
}
exports.SphericalGaussianModel.prototype = Object.create(Model.prototype);
exports.SphericalGaussianModel.fullname = "Gaussian distribution (spherical)";

exports.PlanarExponentialModel = function() {
    Model.call(this, Distributions.PlanarExponential, 
                     5.0, 36, 0.01, 150,
                     [new ArgDef('lattice_L', 'float', 
                                 'Vortex lattice parameter',
                                 'Side of the triangular vortex lattice',
                                 true,
                                 60.0),
                      new ArgDef('B_max', 'float', 
                                 'Maximum magnetic field',
                                 'Intensity of the magnetic field at the core of a vortex', 
                                 true,
                                 50.0),
                      new ArgDef('B_shift', 'float',
                                 'External applied magnetic field',
                                 'Intensity of applied magnetic field that shifts the entire distribution by a fixed value',
                                 false,
                                 0.0, 0.0, 60.0)
                     ], 1.0, 60.0);
    this.distr_width_label = "Lambda";
}
exports.PlanarExponentialModel.prototype = Object.create(Model.prototype);
exports.PlanarExponentialModel.fullname = "Planar exponential distribution";

exports.TwoSiteModel = function() {
    Model.call(this, Distributions.TwoSites,
               5.0, 0, 0.01, 150, 
               [new ArgDef('B_central', 'float', 
                           'Average magnetic field', 
                           'Average magnetic field for the two sites', 
                           false, 0.0, -10.0, 10.0)],
               1.0, 20.0);
    this.distr_width_label = "Magnetic field difference"
}
exports.TwoSiteModel.prototype = Object.create(Model.prototype);
exports.TwoSiteModel.fullname = "Two site model";