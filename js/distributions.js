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