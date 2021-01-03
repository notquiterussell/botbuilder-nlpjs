import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { NlpjsEngine } from './engine';

export class LanguageAnalysis implements Middleware {
  private _languages: [];
  private limit: Number;

  /**
   *
   * @param languages The languages to shortlist
   * @param limit The number of results to return
   */
  constructor(languages: [], limit: Number = 3) {
    this._languages = languages;
    this.limit = limit;
  }

  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    if (context.activity.type === ActivityTypes.Message) {
      const input = context.activity.text;
      try {
        const result = NlpjsEngine.detectLanguage(input, this._languages, this.limit);
        context.turnState.set('language', result);
      } catch (e) {
        throw new Error(`Failed to process entity on ${context.activity.text}. Error: ${e}`);
      }
    }
    await next();
  }
}
