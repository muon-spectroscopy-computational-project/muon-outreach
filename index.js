d3 = require('d3');
Angular = require('angular');
Chartist = require('chartist');
Models = require('./js/models.js');

var skipFunc = function(skip) {
    return function(v, i) { return (i%skip == 0)? v.toFixed(2) : null; };
}

var angApp = Angular.module('muonApp', []);
var muContr = angApp.controller('MuonModelController', function($scope) {

    $scope.loading = false;

    $scope.model_funcs = {
        'uniaxial': Models.UniaxialGaussianModel,
        'spherical': Models.SphericalGaussianModel,
    };

    $scope.model_type = 'uniaxial';

    $scope.update_model = function() {

        // This needs to be done by hand as it's during the update
        var loadButton = Angular.element( document.querySelector( '#plot-loading' ) );
        loadButton.removeClass('is-undisplayed');

        $scope.model = new $scope.model_funcs[$scope.model_type]();
        $scope.plot();
    }

    $scope.skipX = 10;

    $scope.plot = function() {

        var loadButton = Angular.element( document.querySelector( '#plot-loading' ) );
        loadButton.removeClass('is-undisplayed');

        $scope.model.update();

        var options = {
            axisX: {
                labelInterpolationFnc: skipFunc($scope.skipX),        
            },
            axisY: {
                high: 1,
                low: -0.5,
                scaleMinSpace: 50,
            },
            showPoint: false,
        };

        $scope.line = new Chartist.Line('#muon-fid', {labels: $scope.model.t, 
                                                      series: [$scope.model.fid]},
                                        options);

        loadButton.addClass('is-undisplayed');
    }

    $scope.update_model();
    $scope.plot();
});

Angular.element(function() {
  Angular.bootstrap(document, ['muonApp']);
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

