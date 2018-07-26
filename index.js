d3 = require('d3');
Angular = require('angular');
Chartist = require('chartist');
QString = require('query-string');
Models = require('./js/models.js');

var skipFunc = function(skip) {
    return function(v, i) { return (i%skip == 0)? v.toFixed(2) : null; };
}

var angApp = Angular.module('muonApp', []);
var muContr = angApp.controller('MuonModelController', function($scope, 
    $window) {

    $scope.loading = false;

    $scope.model_funcs = {
        'uniaxial': Models.UniaxialGaussianModel,
        'spherical': Models.SphericalGaussianModel,
        'planexp': Models.PlanarExponentialModel,
        'twosite': Models.TwoSiteModel,
    };

    $scope.model_type = 'uniaxial';
    $scope.model_fixed = false;

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
                low: -1,
                scaleMinSpace: 50,
            },
            showPoint: false,
        };

        $scope.line = new Chartist.Line('#muon-fid', {labels: $scope.model.t, 
                                                      series: [$scope.model.fid]},
                                        options);

        loadButton.addClass('is-undisplayed');
    }

    // Through URL parameters, the type and some arguments can be fixed
    var url_params = QString.parse($window.location.search);

    if ('model_type' in url_params && url_params.model_type in $scope.model_funcs) {        
        $scope.model_type = url_params.model_type;
        $scope.model_fixed = true;

        // In this case, also search for fixed arguments
        $scope.update_model();

        var url_model_args = [];
        for (up in url_params) {
            if (up.indexOf('model_arg_') == 0) {
                var argname = up.slice(10); // Everything after model_arg_
                var arg_i = $scope.model.args.findIndex(function(a) {
                    return a.name == argname;
                });
                if (arg_i > -1) {
                    var val = url_params[up];
                    switch($scope.model.args[arg_i].type) {
                        case 'float':
                            val = parseFloat(val);
                            break;
                        case 'bool':
                            val = (val == 'true')
                            break;
                    }
                    $scope.model.arg_vals[arg_i] = val;
                    $scope.model.args[arg_i].fixed = true;
                }
            }
        }
    }
    else {
        $scope.update_model();
    }
    $scope.plot();
});

Angular.element(function() {
  Angular.bootstrap(document, ['muonApp']);
});

var n = 100;
var dx = 0.01;

var skipX = 10;

