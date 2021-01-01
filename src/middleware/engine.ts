import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { NlpManager } from 'node-nlp';

/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */

export class NlpjsEngine extends Engine {
  private readonly _nlu: NlpManager;

  private constructor(nlu: NlpManager) {
    super();
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

  public async categories(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async concepts(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async detectLanguage(input: any, config?: any): Promise<string | undefined> {
    const result = await this.recognize(input);
    if (result && result.localeIso2) {
      return Promise.resolve(result.localeIso2);
    }
    return Promise.resolve(undefined);
  }

  public async emotion(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async entities(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async keyPhrases(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async sentiment(input: any, config?: any): Promise<any | undefined> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve(result.sentiment);
    }
    return Promise.resolve(undefined);
  }
}
