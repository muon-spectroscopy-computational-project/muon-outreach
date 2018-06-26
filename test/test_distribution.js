var UG = require('../js/distributions.js').UniaxialGaussian;
var DysonFID = require('../js/dyson.js').DysonFID;

//console.log(UG(1, 10));

var SG = require('../js/distributions.js').SphericalGaussian;

var PE = require('../js/distributions.js').PlanarExponential;

distr = PE(5.0, 100, 30.0, 100.0);

//console.log(w);
//console.log(SG(1, 10, 1, true));

dfid = new DysonFID(distr.freqs, 0.01, 0, distr.weights);

for (var i = 0; i < 400; ++i) {
    dfid.step();
    console.log(dfid.t, dfid.FID);
}