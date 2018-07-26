/* Various frequency distributions.*/

exports.UniaxialGaussian = function(D, n) {
    // Uniaxial Gaussian distribution of spread D, n points
    n = n || 20;

    freqs = [];
    weights = [];
    for (var i = 0; i < n; ++i) {
        f = (2*(i/(n-1.0))-1)*3;
        freqs.push(D*f);
        weights.push(Math.exp(-f*f));
    }

    return {
        'freqs': freqs,
        'weights': weights
    };
}

exports.SphericalGaussian = function(D, n, B_ext, transverse) {

    n = 2*n || 20; // n must be even
    B_ext = B_ext || 0.0;

    freqs = [];
    weights = [];
    weight0 = 0; // Weight for the 0 frequency term
    omdens_norm = 0;
    for (var i = 0; i < n; ++i) {
        f = (2*(i/(n-1.0))-1)*3;
        freqs.push(D*f);
        // Computing the weights is somewhat harder
        omdens = Math.pow(D*f, 2)*Math.exp(-f*f);
        omdens_norm += omdens;
        if (B_ext > 0) {
            weights.push(0);
            if (!transverse) {
                // Longitudinal. Only theta matters                
                for (var j = 0; j < n; ++j) {
                    costh = 1-2*j/(n-1.0);
                    costh2 = costh*costh;
                    weight0 += costh2*Math.exp(2*f*B_ext/D*costh)*omdens;
                    weights[i] += (1-costh2)*Math.exp(2*f*B_ext/D*costh)*omdens;
                }
            }
            else {
                // Transverse case
                for (var j = 0; j < n; ++j) {
                    costh = 1-2*j/(n-1.0);
                    costh2 = costh*costh;
                    sinth = Math.sqrt(1-costh2);
                    for (var k = 0; k < n; ++k) {
                        cosphi = Math.cos(k*2*Math.PI/n);
                        weight0 += costh2*Math.exp(2*f*B_ext/D*sinth*cosphi)*omdens;
                        weights[i] += (1-costh2)*Math.exp(2*f*B_ext/D*sinth*cosphi)*omdens;                        
                    }
                }                
            }
        }
        else {
            weight0 += 1.0/3.0*omdens;
            weights.push(2.0/3.0*omdens);
        }
    }

    freqs.push(0);
    weights.push(weight0);
    weights = weights.map(function(v) { return v/omdens_norm; }); // Normalize

    return {
        'freqs': freqs,
        'weights': weights
    };
}

exports.PlanarExponential = function(lambda, n, L, B_max, B_shift, cut_lambda) {
    // Planar exponential distribution with coherence length lambda
    // and triangular lattice parameter L

    n = n || 20;
    cut_lambda = cut_lambda || 5.0;
    L = L || lambda*cut_lambda;
    B_max = B_max || 1.0;
    B_shift = B_shift || 0.0;

    freqs = [];
    weights = [];

    /*
    for (var i = 0; i < n; ++i) {
        B = (B_max-B_min)*(i/(n-1.0))+B_min
        freqs.push(B);
        weights.push(-Math.log(B/B_max));
    }
    */

    // Maximum distance, over which everything is considered as zero
    var l = Math.min(L/2.0, lambda*cut_lambda);
    // Fraction of non-zero frequency area
    var f = l*l*4.0/(L*L);
    if (f < 1) {
        freqs.push(B_shift);
        weights.push(1.0-f);
    }
    // Now non-zero frequencies
    var B_l_step = Math.sqrt(13.0/48.0)*l/n;
    for (var i = 0; i < n; ++i) {
        B_l = B_l_step*(i+0.5);
        //console.log(B_max);
        B = B_max*Math.exp(-B_l/lambda);
        w = (2*i+1.0)/(n*n);

        freqs.push(B+B_shift);
        weights.push(w);
    }

    return {
        'freqs': freqs,
        'weights': weights
    };
}

exports.TwoSites = function(delta_B, _, B_central) {

    return {
        'freqs': [B_central-delta_B/2.0, B_central+delta_B/2.0, 0.0],
        'weights': [1.0/3.0, 1.0/3.0, 1.0/3.0]
    };

}