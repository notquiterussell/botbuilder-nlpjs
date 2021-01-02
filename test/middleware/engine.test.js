const path = require('path');
const { NlpjsEngine } = require('../../lib/middleware/engine');

describe('Engine tests', () => {
  let engine;

  beforeAll(async () => {
    engine = await NlpjsEngine.build(
      {
        languages: ['en'],
        forceNER: true,
      },
      path.join(__dirname, 'private.json')
    );
    expect(engine).toBeDefined();
  });

  it('Can detect the language of an utterance', async () => {
    expect(await engine.detectLanguage('I am a chatbot and I love to help.')).toEqual('en');
  });

  it('Can detect the sentiment of an utterance', async () => {
    expect(await engine.sentiment('I am a chatbot and I love to help.')).toEqual({
      average: 0.125,
      locale: 'en',
      numHits: 3,
      numWords: 9,
      score: 1.125,
      type: 'senticon',
      vote: 'positive',
    });

    expect(await engine.sentiment('I am a chatbot and I hate cats.')).toEqual({
      average: -0.09375,
      locale: 'en',
      numHits: 1,
      numWords: 8,
      score: -0.75,
      type: 'senticon',
      vote: 'negative',
    });
  });

  it('Can detect the categories of an utterance', async () => {
    expect(await engine.classifications('Hello.')).toEqual([{ intent: 'smalltalk.greetings.hello', score: 1 }]);
    expect(await engine.classifications('I am a chatbot and I love to help.')).toEqual([
      { intent: 'smalltalk.agent.chatbot', score: 0.6988612924435499 },
      { intent: 'smalltalk.greetings.nice_to_see_you', score: 0.2634891438375071 },
      { intent: 'smalltalk.user.going_to_bed', score: 0.023582353418248395 },
      { intent: 'smalltalk.agent.answer_my_question', score: 0.014067210300694653 },
    ]);
  });
});
