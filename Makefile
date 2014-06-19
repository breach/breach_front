clean:
	rm -rf node_modules

install: clean
	npm install

start:
	rm -f ~/log/breach_front.fvr
	forever start -a -l ~/log/breach_front.fvr index.js

run:
	node index.js

.PHONY: clean install start run
