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
    expect(await NlpjsEngine.detectLanguage('I am a chatbot and I love to help.')).toHaveLength(3);

    expect(
      await NlpjsEngine.detectLanguage(
        "Quan arriba la nit i la terra és fosca i la lluna és l'única llum que podem veure"
      )
    ).toHaveLength(3);
  });

  it('Can detect the sentiment of an utterance', async () => {
    expect(await engine.sentiment('I am a chatbot and I love to help.')).toEqual({
      comparative: 0.1771111111111111,
      language: 'en',
      numHits: 4,
      numWords: 9,
      score: 1.5939999999999999,
      type: 'senticon',
      vote: 'positive',
    });
  });

  it('Can detect the categories of an utterance', async () => {
    expect(await engine.classifications('Hello.')).toEqual([{ intent: 'smalltalk/greetings.hello', score: 1 }]);
    expect(await engine.classifications('What are you?')).toEqual([
      { intent: 'smalltalk/agent.acquaintance:private', score: 1 },
    ]);
  });

  it('Can detect entities in the utterance', async () => {
    expect(await engine.entities('Hello.')).toEqual([]);
    expect(await engine.entities('Please send £100 to person@example.com, quoting 11112222')).toEqual([
      {
        accuracy: 0.95,
        end: 15,
        entity: 'currency',
        len: 4,
        resolution: {
          localeUnit: 'Pound',
          strValue: '100',
          unit: 'Pound',
          value: 100,
        },
        sourceText: '£100',
        start: 12,
        utteranceText: '£100',
      },
      {
        accuracy: 0.95,
        end: 37,
        entity: 'email',
        len: 18,
        resolution: {
          value: 'person@example.com',
        },
        sourceText: 'person@example.com',
        start: 20,
        utteranceText: 'person@example.com',
      },
      {
        accuracy: 0.99,
        end: 46,
        entity: 'toCity',
        len: 8,
        sourceText: 'quoting ',
        start: 39,
        type: 'afterLast',
        utteranceText: 'quoting ',
      },
      {
        accuracy: 0.95,
        end: 55,
        entity: 'number',
        len: 8,
        resolution: {
          strValue: '11112222',
          subtype: 'integer',
          value: 11112222,
        },
        sourceText: '11112222',
        start: 48,
        utteranceText: '11112222',
      },
      {
        accuracy: 0.95,
        end: 55,
        entity: 'phonenumber',
        len: 8,
        resolution: {
          score: '0.1',
          value: '11112222',
        },
        sourceText: '11112222',
        start: 48,
        utteranceText: '11112222',
      },
    ]);
  });

  it('Can provide an intent', async () => {
    expect(await engine.intent('I am a chatbot and I love to help.')).toEqual({
      domain: 'smalltalk',
      intent: 'smalltalk/agent.chatbot:private',
      score: 0.6517505013911639,
    });
  });

  it('Can provide an answer', async () => {
    expect(["That's me. I chat, therefore I am.", "Indeed I am. I'll be here whenever you need me."]).toContain(
      await engine.answer('I am a chatbot and I love to help.')
    );
  });

  it('Can fill slots', async () => {
    let actual = await engine.slots('I want a train from Leeds to Manchester tomorrow');
    expect(actual.date.resolution.date).toEqual(expect.any(Date));
    delete actual.date.resolution.date;
    expect(actual).toEqual({
      date: {
        accuracy: 0.95,
        end: 47,
        entity: 'date',
        len: 8,
        resolution: {
          strValue: '2021-02-22',
          timex: '2021-02-22',
          type: 'date',
        },
        sourceText: 'tomorrow',
        start: 40,
        utteranceText: 'tomorrow',
      },
      fromCity: {
        accuracy: 1,
        end: 24,
        entity: 'fromCity',
        len: 5,
        sourceText: 'Leeds',
        start: 20,
        type: 'between',
        utteranceText: 'Leeds',
      },
      toCity: {
        accuracy: 0.99,
        end: 38,
        entity: 'toCity',
        len: 10,
        sourceText: 'Manchester',
        start: 29,
        type: 'afterLast',
        utteranceText: 'Manchester',
      },
    });
  });
});
