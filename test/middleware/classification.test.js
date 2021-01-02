const { TestAdapter } = require('botbuilder');

const { NlpjsEngine } = require('../../lib/middleware/engine');
const { Classification } = require('../../lib/middleware/classification');

const path = require('path');

describe('Classification middleware tests', () => {
  let classifier;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        settings: { languages: ['en'] },
      },
      path.join(__dirname, 'private.json')
    );
    classifier = new Classification(engine);
  });

  it('should have classifications', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('classifications')).toEqual([
        {
          intent: 'smalltalk.greetings.hello',
          score: 1,
        },
      ]);
    });
    adapter.use(classifier);
    await adapter.send('Hello');
  });

  it('should have classifications', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('classifications')).toEqual([{ intent: 'smalltalk.user.sad', score: 1 }]);
    });
    adapter.use(classifier);
    await adapter.send('I am sad');
  });
});
