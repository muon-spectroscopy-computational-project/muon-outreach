d3 = require('d3');
angular = require('angular');
Chartist = require('chartist');
Models = require('./js/models.js');

var skipFunc = function(skip) {
    return function(v, i) { return (i%skip == 0)? v.toFixed(2) : null; };
}

var angApp = angular.module('muonApp', []);
var muContr = angApp.controller('MuonModelController', function($scope) {

    this.model_funcs = {
        'uniaxial': Models.UniaxialGaussianModel,
        'spherical': Models.SphericalGaussianModel,
    };

    this.model_type = 'uniaxial';

    this.update_model = function() {
        this.model = new this.model_funcs[this.model_type]();
    }

    this.skipX = 10;

    this.plot = function() {

        this.model.update();

        var options = {
            axisX: {
                labelInterpolationFnc: skipFunc(this.skipX),        
            },
            axisY: {
                scaleMinSpace: 50,
            },
            showPoint: false,
        };

        this.line = new Chartist.Line('#muon-fid', {labels: this.model.t, 
                                                    series: [this.model.fid]},
                                      options);
    }

    this.update_model();
    this.plot();
});

angular.element(function() {
  angular.bootstrap(document, ['muonApp']);
});

var n = 100;
var dx = 0.01;

var skipX = 10;


/*
// Test with a long array?
distr = UniaxialGaussian(5.0, 36);
freqs = distr.freqs;
weights = distr.weights;

dfid = new DysonFID(freqs, 0.01, 6.0, weights);

t = [0];
fid = [1];

for (var i = 0; i < 150; ++i) {
    dfid.step();
    t.push(dfid.t);
    fid.push(dfid.FID);
}
*/

//var uniModel = UniaxialGaussianModel;
//uniModel.update();

