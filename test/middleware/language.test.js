const { TestAdapter } = require('botbuilder');

const { NlpjsEngine } = require('../../lib/middleware/engine');
const { LanguageAnalysis } = require('../../lib/middleware/language');

const path = require('path');

describe('Language middleware tests', () => {
  let lang;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        languages: ['en'],
        forceNER: true,
      },
      path.join(__dirname, 'private.json')
    );
    lang = new LanguageAnalysis(engine);
  });

  it('should identify languages', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('language')).toEqual([
        { alpha3: 'eng', alpha2: 'en', language: 'English', score: 1 },
        {
          alpha3: 'glg',
          alpha2: 'gl',
          language: 'Galician',
          score: 0.5674114289691654,
        },
        {
          alpha3: 'fra',
          alpha2: 'fr',
          language: 'French',
          score: 0.5533514303612446,
        },
      ]);
    });
    adapter.use(lang);
    await adapter.send('Please send £100 to person@example.com, quoting 11112222');
  });
});
