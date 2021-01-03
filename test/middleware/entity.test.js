const { TestAdapter } = require('botbuilder');

const { NlpjsEngine } = require('../../lib/middleware/engine');
const { EntityAnalysis } = require('../../lib/middleware/entity');

const path = require('path');

describe('Entity middleware tests', () => {
  let entity;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        languages: ['en'],
        forceNER: true,
      },
      path.join(__dirname, 'private.json')
    );
    entity = new EntityAnalysis(engine);
  });

  it('should identify entities', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('entities')).toEqual([
        {
          accuracy: 0.95,
          alias: 'number_0',
          end: 15,
          entity: 'number',
          len: 3,
          resolution: {
            strValue: '100',
            subtype: 'integer',
            value: 100,
          },
          sourceText: '100',
          start: 13,
          utteranceText: '100',
        },
        {
          accuracy: 0.95,
          alias: 'number_1',
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
      ]);
    });
    adapter.use(entity);
    await adapter.send('Please send £100 to person@example.com, quoting 11112222');
  });

  it('should have no entities', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('entities')).toEqual([]);
    });
    adapter.use(entity);
    await adapter.send('I am unknown');
  });
});
