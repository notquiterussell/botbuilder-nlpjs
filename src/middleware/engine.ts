import { Language, NlpManager } from 'node-nlp';

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

  public static detectLanguage(
    input: string,
    languages: [],
    limit: Number = 3
  ): { alpha3: string; alpha2: string; language: string; score: number } {
    const language = new Language();
    const result = language.guess(input, languages, limit);
    if (result) {
      return result;
    }
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

  public async intent(input: string): Promise<{ intent: string; score: number; domain: string } | undefined> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve({ intent: result.intent, score: result.score, domain: result.domain });
    }
    return Promise.resolve(undefined);
  }

  public async answer(input: string): Promise<string | undefined> {
    const result = await this.recognize(input);
    if (result) {
      return Promise.resolve(result.answer);
    }
    return Promise.resolve(undefined);
  }
}
