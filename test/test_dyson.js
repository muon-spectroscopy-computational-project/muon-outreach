var DysonFID = require('../js/dyson.js').DysonFID;

nu = [0, 1, 10, 100];
dfids = [];
for (var i = 0; i < nu.length; ++i) {
    dfids.push(new DysonFID([20, -20], 0.001, nu[i]));
}

for (var i = 0; i < 1000; ++i) {
    vals = '';
    for (var j = 0; j < dfids.length; ++j) {
        vals += dfids[j].FID + ' ';
        dfids[j].step();
    }
    console.log(dfids[0].t + ' ' + vals);
}

// Test with a long array?
freqs = [];
for (var i = 0; i < 30; ++i) {
    freqs.push(Math.random()*10);
}

dfid = new DysonFID(freqs, 0.001, 0);

for (var i = 0; i < 100; ++i) {
    dfid.step();
    console.log(dfid.t, dfid.FID);
}