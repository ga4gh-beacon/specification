
all: beacon.html

beacon.html: beacon.yaml
	python yaml-to-html.py < $< > $@

clean:
	rm beacon.html
