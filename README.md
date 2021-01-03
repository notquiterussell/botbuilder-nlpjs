# NLP.js based middleware for Microsoft Bot framework

This is a middleware plugin for the [Microsoft Bot framework](https://dev.botframework.com).

The plugin uses a local, private model via [NLP.js](https://github.com/axa-group/nlp.js/) to extract:
* Input classifications
* Intents for the given input
* The sentiment of the input
* Entities in the input (see the note below on entity analysis)
* Answers to the input, to allow building Question and Answer bots

Each one can be added individually to the bot, but they can all share the same bot model to reduce memory
consumption.

## Adding the middleware

To add the middleware first await the build of the NlpjsEngine, then instantiate the components you
wish to add. Finally, add the components to the required adapters.

Note that you will need a built model file to drive the NLP, see [this example](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlp-manager.md#saveload-using-files)
for how to build the required file.

```javascript
const { NlpjsEngine, Answer, IntentAnalysis, EntityAnalysis, LanguageAnalysis } = require('botbuilder-nlpjs');
// Other setup
NlpjsEngine.build({ languages: ['en'], forceNER: true }, path.join(__dirname, 'features', 'private.json')).then(
  nlpEngine => {
    // Note that there is nothing special about using the Slack adapter
    const adapter = new SlackAdapter({/* Slack setup options */});

    adapter.use(new Answer(nlpEngine));
    adapter.use(new IntentAnalysis(nlpEngine));
    adapter.use(new EntityAnalysis(nlpEngine));
    adapter.use(new LanguageAnalysis(["en", "de"], 3))

    // Final setup and run
  }
);
```


## Note on EntityAnalysis

For the entity analysis to work correctly the NlpjsEngine must be built using the setting `forceNER: true`,
for example:

```javascript
NlpjsEngine.build(
    { languages: ['en'], forceNER: true },
    path.join(__dirname, 'features', 'private.json')
  ).then(nlpEngine => {
  // Do stuff with the engine
});
```
