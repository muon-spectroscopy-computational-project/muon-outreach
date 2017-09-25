var distr = require('../js/distributions');
var dyn = require('../js/dynamics');
var muonExperiment = require('../js/experiment').muonExperiment;

var Delta = 0.01;
var Bext = [0, 0, 0];
var d = distr.gaussianDistribution(Delta, Bext);

var tsteps = Infinity;
var dd = dyn.jumpDynamics(d, tsteps);

var n = 1000;
var exp = new muonExperiment(n, dd);

for (var i = 0; i < 500; ++i) {
    exp.step();
    console.log(i + ' ' + exp.Pz());
}
