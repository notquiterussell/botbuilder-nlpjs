import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { NlpManager } from 'node-nlp';
import * as path from 'path';

/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */

export class NlpjsEngine extends Engine {
  private _settings: any;
  private _nlu: NlpManager;

  constructor(settings: any) {
    super();
    this._settings = settings;
    this._nlu = new NlpManager(settings);
  }

  public static async WithNluModel(modelPath: string) {
    return async (n: NlpManager): Promise<void> => {
      await n.load(modelPath);
    };
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

  public async detectLanguage(input: any, config?: any): Promise<any> {
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

  public async sentiment(input: any, config?: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}
