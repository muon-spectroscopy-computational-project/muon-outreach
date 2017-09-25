var utils = require('../js/utils');

var n = 3000;
var bins = 40;
var dx = 3;

var hist = [];

for (var i = 0; i < bins; ++i) {
    hist.push(0);
}

for (var i = 0; i < n; ++i) {
    var x = utils.rnd_normal();
    // Bin?
    if (x < -dx || x >= dx) {
        --i;
        continue;
    }
    var x_i = Math.floor((x+dx)/(2*dx)*bins);
    hist[x_i]++;
}

// Now print out
var bw = 2*dx/bins;
for (var i = 0; i < bins; ++i) {
    console.log(bw*(i+0.5)-dx + ' ' + hist[i]/n);
}
