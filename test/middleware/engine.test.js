const assert = require('assert');
const { NlpjsEngine } = require('../../lib/middleware/engine');

describe('Engine tests', () => {
  describe('Can boot the nlu', async () => {
    const engine = new NlpjsEngine.WithNluModel('../../../target/smalltalk-private.json');
    assert.strictEqual(engine, {});
  });
});
