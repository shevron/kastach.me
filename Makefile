SHELL := bash
NPM := npm

DIST_DIR := dist
DIST_FILES := $(DIST_DIR)/assets/moe-logo.png $(DIST_DIR)/index.html $(DIST_DIR)/bundle.js
SRC_FILES := $(shell find ./src/ -type f)

$(DIST_DIR):
	mkdir -p $(DIST_DIR)

test:
	$(NPM) run lint

$(DIST_FILES): $(DIST_DIR) $(SRC_FILES)
	$(NPM) run build

build: $(DIST_FILES)

distclean:
	rm -rf $(DIST_DIR)

deploy: build
	# TODO: Push code to S3
	# TODO: invalidate CDN cache
