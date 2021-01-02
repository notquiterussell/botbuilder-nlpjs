const { TestAdapter } = require('botbuilder');
const { SentimentAnalysis } = require('../../lib/middleware/sentiment');

const path = require('path');

describe('Sentiment middleware tests', () => {
  let sentiment;

  beforeAll(async () => {
    sentiment = await SentimentAnalysis.build(path.join(__dirname, 'private.json'), {
      settings: { languages: ['en'] },
    });
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
