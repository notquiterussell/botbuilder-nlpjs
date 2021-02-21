const { Slots } = require('../../lib/middleware/slots');
const { TestAdapter } = require('botbuilder');
const { NlpjsEngine } = require('../../lib/middleware/engine');
const path = require('path');

describe('Slot middleware tests', () => {
  let slot;

  beforeAll(async () => {
    const engine = await NlpjsEngine.build(
      {
        settings: { languages: ['en'] },
      },
      path.join(__dirname, 'private.json')
    );
    slot = new Slots(engine);
  });

  it('Should create slots for found entities', async () => {
    const adapter = new TestAdapter(async context => {
      expect(context.turnState.get('slots')).toEqual({
        currency: {
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
        email: {
          accuracy: 0.95,
          end: 46,
          entity: 'email',
          len: 21,
          resolution: {
            value: 'someone@somewhere.com',
          },
          sourceText: 'someone@somewhere.com',
          start: 26,
          utteranceText: 'someone@somewhere.com',
        },
        toCity: {
          accuracy: 0.99,
          end: 24,
          entity: 'toCity',
          len: 5,
          sourceText: 'me at',
          start: 20,
          type: 'afterLast',
          utteranceText: 'me at',
        },
      });
    });
    adapter.use(slot);
    await adapter.send('Please send £100 to me at someone@somewhere.com');
  });
});
