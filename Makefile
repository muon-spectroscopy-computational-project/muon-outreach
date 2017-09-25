build/muon.min.js:	index.js $(shell find js -type f)
	browserify index.js | uglifyjs > build/muon.min.js

build/stylesheet.min.css: $(shell find scss -type f)
	sass.ruby2.1 -t compressed scss/main.scss > build/stylesheet.min.css

all: build/stylesheet.min.css build/muon.min.js
	@echo "Building all"

push-page:
	git subtree push --prefix build origin gh-pages

test:
	http-server build/