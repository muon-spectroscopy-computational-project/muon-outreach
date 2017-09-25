var Vector3 = require('../js/vector').Vector3;
var distr = require('../js/distributions');

var v = new Vector3([1,2,5]);

v.x = 2;
console.log(v.x);
console.log(v.z);
v.z = -1
console.log(v[2]);

var d = distr.gaussianDistribution(1, [0, 0, 0]);

var dyn = require('../js/dynamics');

rjD = new (dyn.jumpRndDynamics(d, 0.01))();


for (var i = 0; i < 20; ++i) {
    console.log(rjD.next());
}
