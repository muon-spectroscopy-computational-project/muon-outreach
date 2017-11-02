/* A Dyson equation based algorithm to solve the problem of a dynamical
process generated FID in all regimes. It constitutes a generalisation of the
algorithm presented by Pieruccini and Sturniolo in:

S. Sturniolo, M. Pieruccini, "An exact analytical solution for the evolution of a 
dipole–dipole interacting system under spherical diffusion in magnetic resonance experiments"
JMR 223 138-147 (2012)

The following algorithm has been developed by S. Sturniolo and will be subject
of future publication. */

var num = require('numeric');

function DysonFID(frequencies, dt, nu, weights) {

    N = frequencies.length;
    weights = num.mul(weights, 1.0/num.sum(weights)) || Array(N).fill(1.0/N);
    // Weights matrix (repeat)
    wm = [];
    for (var i = 0; i < N; ++i) {
        wm.push(Array(N).fill(weights[i]));
    }

    // Single step interaction-free Green's function
    var decay = Math.exp(-nu*dt);
    var G0 = new num.T(num.add(num.mul(num.identity(N), decay),
                               num.mul(wm, 1.0-decay)));

    // Step matrix for full Green's function
    reF = [];
    imF = [];
    for (var i = 0; i < N; ++i) {
        reF.push([]);
        imF.push([]);
        for (var j = 0; j < N; ++j) {
            reF[i].push(j == i? 1.0 : 0.0);
            imF[i].push(j == i? 0.5*dt*frequencies[i] : 0.0);
        }
    }
    F = new num.T(reF, imF);
    this._M = F.conj().inv().dot(G0.dot(F));

    // Now to actually build the FID
    this._dt = dt;
    this.t = 0;
    this.FID = 1;
    this.history = {
        t: [0],
        FID: [1]
    };
    this._G = new num.T(num.diag(weights));
}

DysonFID.prototype = {

    step: function() {
        this._G = this._M.dot(this._G);
        this.t += this._dt;
        this.FID = num.sum(this._G.x);
        this.history.t.push(this.t);
        this.history.FID.push(this.FID);        
    }
}

exports.DysonFID = DysonFID;
