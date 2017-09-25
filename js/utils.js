// Box-Muller transform
function randn_bm(x0, sigma) {

    x0 = x0 || 0.0;
    sigma = sigma || 1.0;

    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    var n = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return n*sigma + x0;
}

exports.rnd_normal = randn_bm;