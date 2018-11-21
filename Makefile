
all: beacon.html

beacon.html: beacon.yaml ./node_modules/.bin/redoc-cli
	./node_modules/.bin/redoc-cli bundle -o $@ $<

./node_modules/.bin/redoc-cli:
	npm install redoc-cli

clean:
	rm beacon.html

cleanall: clean
	rm -rf ./node_modules package-lock.json
