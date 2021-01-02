const { TestAdapter } = require('botbuilder');

const { NlpjsEngine } = require('../../lib/middleware/engine');
const { SentimentAnalysis } = require('../../lib/middleware/sentiment');

const path = require('path');

describe('Sentiment middleware tests', () => {
  let sentiment;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        settings: { languages: ['en'] },
      },
      path.join(__dirname, 'private.json')
    );
    sentiment = new SentimentAnalysis(engine);
  });

  it('should have a positive sentiment', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('sentimentScore')).toEqual(0.792);
    });
    adapter.use(sentiment);
    await adapter.send('I am glorious');
  });

  it('should have a negative sentiment', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('sentimentScore')).toEqual(-0.708);
    });
    adapter.use(sentiment);
    await adapter.send('I am sad');
  });
});
