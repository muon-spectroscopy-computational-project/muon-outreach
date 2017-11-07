d3 = require('d3');
Chartist = require('chartist');

var n = 100;
var dx = 0.01;
var x = Chartist.times(n).map(function(x, i) { return i*dx; });
var y = x.map(function(x) { return Math.cos(x*10); });

var data = {
    labels: x,
    series: [y]
};

var skipX = 10;
var skipFunc = function(skip) {
    return function(v, i) { return (i%skip == 0)? v.toFixed(2) : null; };
}

var options = {
    axisX: {
        labelInterpolationFnc: skipFunc(skipX),        
    },
    axisY: {
        scaleMinSpace: 50,
    },
    showPoint: false,
}

new Chartist.Line('#muon-fid', data, options);