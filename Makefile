.PHONY: $(MAKECMDGOALS)

# `make setup` will be used after cloning or downloading to fulfill
# dependencies, and setup the the project in an initial state.
# This is where you might download rubygems, node_modules, packages,
# compile code, build container images, initialize a database,
# anything else that needs to happen before your server is started
# for the first time
setup:
	$(info Installing packages and dependencies...)
	npm install -g typescript
	npm install -g @angular/cli
	npm install -g mocha
	npm install
	cd ./src/client/url-shortener && npm install

# `make server` will be used after `make setup` in order to start
# an http server process that listens on any unreserved port
#	of your choice (e.g. 8080). 
server:
	$(info Starting server...)
	tsc -p ./src/server/tsconfig.json
	cd ./src/client/url-shortener && ng build
	node ./dist/app.js

# `make test` will be used after `make setup` in order to run
# your test suite.
test:
	$(info Running tests...)
	tsc -p ./src/server/tsconfig.json
	mocha "./dist/**/*.spec.js"
	cd ./src/client/url-shortener && ng test