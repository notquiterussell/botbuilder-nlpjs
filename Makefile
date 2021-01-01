.PHONY: help test

EXECUTABLES = node npm
K := $(foreach exec,$(EXECUTABLES), $(if $(shell which $(exec)),some string,$(error "No $(exec) in PATH. Please install.")))

.clean:
	rm -r target;\
	mkdir target

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

setup: ## Set up the environment
	npm ci;

build: .clean train ## Compile to JS
	npm run build;

test: ## Run the tests
	npm test;

train: .clean ## Train the bot
	npm run smalltalk; \
	npm run train;

start: ## Run the bot
	npm start;
