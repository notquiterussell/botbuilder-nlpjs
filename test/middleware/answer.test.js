const { Answer } = require('../../lib/middleware/answer');
const { TestAdapter } = require('botbuilder');
const { NlpjsEngine } = require('../../lib/middleware/engine');
const path = require('path');

describe('Answer middleware tests', () => {
  let answer;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        settings: { languages: ['en'] },
      },
      path.join(__dirname, 'private.json')
    );
    answer = new Answer(engine);
  });

  it('should have a reply', async () => {
    const adapter = new TestAdapter(async context => {
      expect(['Hi there, friend!', 'Hey!', 'Good day!', 'Howdy.']).toContain(context.turnState.get('answer'));
    });
    adapter.use(answer);
    await adapter.send('Hello');
  });

  it('should have no reply', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('answer')).toBeUndefined();
    });
    adapter.use(answer);
    await adapter.send('I am unknown');
  });
});
