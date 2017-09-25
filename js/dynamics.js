// A dynamical model consists of a static distribution function and a 
// dynamics model function; it returns a class ready to be instantiated

exports.jumpDynamics = function(distr, tjump) {

    var dyn = function() {
        this.distr = distr;
        this.tjump = tjump;

        this.offset = Math.floor(Math.random()*tjump);
        this.steps = 0;

        this.B = this.distr();
    }

    dyn.prototype = {
        next: function() {

            if ((this.steps+this.offset)%this.tjump == 0) {
                this.B = this.distr();
            }
            this.steps = (this.steps+1)%this.tjump;

            return this.B;
        }
    }

    return dyn;
}

exports.jumpRndDynamics = function(distr, nu) {

    var dyn = function() {
        this.distr = distr;
        this.nu = nu;

        this.steps = 0;

        this.B = this.distr();
    }

    dyn.prototype = {
        next: function() {

            if (Math.random() > Math.exp(-nu*this.steps)) {
                this.B = this.distr();
            }
            this.steps++;

            return this.B;
        }
    }

    return dyn;
}
