build/muon.min.js:	index.js $(shell find js -type f)
	browserify index.js | uglifyjs > build/muon.min.js

build/stylesheet.min.css: $(shell find scss -type f) $(shell find vendor -type f)
	sass -t compressed scss/*.scss > build/stylesheet.min.css

clean:
	rm build/muon.min.js build/stylesheet.min.css

all: build/stylesheet.min.css build/muon.min.js
	@echo "Building all"

push-page:
	git subtree push --prefix build origin gh-pages

test_server:
	http-server build/

.DELETE_ON_ERROR: