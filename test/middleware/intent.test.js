const { TestAdapter } = require('botbuilder');

const { NlpjsEngine } = require('../../lib/middleware/engine');
const { IntentAnalysis } = require('../../lib/middleware/intent');

const path = require('path');

describe('Intent middleware tests', () => {
  let intent;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        settings: { languages: ['en'], nlu: { useNoneFeature: true } },
      },
      path.join(__dirname, 'private.json')
    );
    intent = new IntentAnalysis(engine);
  });

  it('should identify intent', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('intent')).toEqual({
        intent: 'smalltalk/greetings.hello',
        score: 1,
        domain: 'smalltalk',
      });
    });
    adapter.use(intent);
    await adapter.send('Hello');
  });

  it('should have None intent', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('intent')).toEqual({ intent: 'None', score: 0.6801592088124435 });
    });
    adapter.use(intent);
    await adapter.send('I am unknown');
  });
});
