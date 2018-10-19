# The Muon Playground

The Muon Playground is a Javascript web app designed to simulate the Free Induction Decay (FID) signal observed in a number of different magnetic field distributions and in presence of relaxation and dynamical processes.

## The algorithm

While muon FIDs are often approximated by mathematical models specific to certain field distributions and valid only in certain dynamical regimes (like the Kubo-Toyabe function), the Muon Playground adopts a different approach. Using a numerical modification of the algorithm described in S. Sturniolo, M. Pieruccini, "An exact analytical solution for the evolution of a dipole–dipole interacting system under spherical diffusion in magnetic resonance experiments" [JMR 223 (2012)  138-147], in this app all FIDs are calculated using a Green's function method based simply on a sampling of the static field distribution and an assumption of uncorrelated dynamics with a single relaxation time. This means that the same method can be used for any model in any dynamical regime, without need for specific formulas.

## How to use 

The Muon Playground is a simple static webpage; the necessary files to host and run it are all found in the `build` folder. The page can also be seen live [on Github pages](https://muon-spectroscopy-computational-project.github.io/muon-outreach/). From there, it can be embedded within your website if you wanted to. The embedded page can be customised with the use of URL parameters. For example,

    https://muon-spectroscopy-computational-project.github.io/muon-outreach/?nodescr&model_type=twosite

will produce a page without the description box and using the "two site" field distribution. Here's a full list of all possible URL parameters:

* `nodescr` [boolean]: if present, the description box will be removed and plot and controls will be arranged horizontally
* `model_type` [string]: designates the model type to use; if present, the "Distribution type" dropdown will be disappeared and the given model will be fixed. Accepted values are `uniaxial`, `spherical`, `planexp` and `twosite`, corresponding respectively to uniaxial and spherical Gaussian, planar exponential, and two site distribution.
* `model_arg_<argument name>`: fixes the value of `<argument name>` for the given model. These are the distribution specific arguments: their names and meanings change depending on the model.

### Distribution specific arguments 

Here is a list of arguments, classified by model, that can be used in `model_arg_<argument name>`.

#### Uniaxial Gaussian

None

#### Spherical Gaussian

* `B_external` [float]: External field applied to the sample
* `is_transverse` [bool]: If checked, the external field is applied in a direction transverse to the magnetization

#### Planar exponential

* `lattice_L` [float]: Side of the triangular vortex lattice
* `B_max` [float]: Intensity of the magnetic field at the core of a vortex
* `B_shift` [float]: Intensity of applied magnetic field that shifts the entire distribution by a fixed value

#### Two sites

* `B_central` [float]: Average magnetic field for the two sites


## How to contribute

Contributions are welcome. There are no specific style guidelines at the moment, just try to be consistent with what you see. When editing the code, use `make` to rebuild JS and CSS files, while `make test_server` runs Node's native HTTP server for testing.
If you're interested simply in adding a new model, there are three steps:

* create a new `Distribution` function in `js/distributions.js`. The function must return a dictionary containing sampled frequencies and their weights in the form `{'freqs': [], 'weights': []}`. Remember to include this in the `exports` of the module.
* create a new `Model` object in `js/models.js`. This must inherit from the `Model` prototype and, again, be passed to `exports`. Follow the example of the existing models. When creating a `Model`, arguments are passed to it defining the way it will be computed. These are the `Distribution` used, the starting "spread" parameter for it (for example, the Gaussian's standard deviation), the number of sampled points, the time step and number of time points (by default 0.01 and 150), then a list of additional arguments created as `ArgDef` objects and finally the minimum and maximum values, in order, for the spread parameter, the jumping frequency, and the relaxation time T1. It's also important to add a `fullname` member in order to pretty print the model's name in the main page.
* finally, in `index.js`, add a reference to the newly created model in `$scope.model_funcs`.

Optionally, you can also create a description in `build/index.html`, controlled by a `ng-switch-when` statement.

## Dependencies

The Muon Playground makes use of [Node](https://nodejs.org/en/), [Angular.js](https://angularjs.org/), [Chartist](https://gionkunz.github.io/chartist-js/), [query-string](https://www.npmjs.com/package/query-string), and [Bulma](https://bulma.io/) for formatting. Browserify, UglifyJS, SASS and UglifyCSS are also required for building the page during development.

## License

The Muon Playground is released under the MIT License. See the `LICENSE` file for more details.