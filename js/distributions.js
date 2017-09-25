var utils = require('./utils');

// Gaussian distribution of fields
exports.gaussianDistribution = function(Delta, Bext) {
    return function() {
        return [utils.rnd_normal(Bext[0], Delta), 
                utils.rnd_normal(Bext[1], Delta), 
                utils.rnd_normal(Bext[2], Delta)];
    }
}