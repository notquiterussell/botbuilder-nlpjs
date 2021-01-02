import { NlpManager } from 'node-nlp';

/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */

export class NlpjsEngine {
  private readonly _nlu: NlpManager;

  private constructor(nlu: NlpManager) {
    this._nlu = nlu;
  }

  public static async build(settings: any, modelPath: string): Promise<NlpjsEngine> {
    const nlu = new NlpManager(settings);
    await nlu.load(modelPath);
    return new NlpjsEngine(nlu);
  }

  private async recognize(text: string): Promise<any> {
    return this._nlu.process(text);
  }

  public async classifications(input: string): Promise<[any]> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve(
        result.classifications.reduce((acc, classification) => {
          if (classification.score > 0) {
            acc.push(classification);
          }
          return acc;
        }, [])
      );
    }
    return Promise.resolve(undefined);
  }

  public async detectLanguage(input: string): Promise<string | undefined> {
    const result = await this.recognize(input);
    if (result && result.localeIso2) {
      return Promise.resolve(result.localeIso2);
    }
    return Promise.resolve(undefined);
  }

  public async entities(input: string): Promise<[any]> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve(result.entities);
    }
    return Promise.resolve(undefined);
  }

  public async sentiment(input: string): Promise<{ score: number; vote: string } | undefined> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve(result.sentiment);
    }
    return Promise.resolve(undefined);
  }
}
