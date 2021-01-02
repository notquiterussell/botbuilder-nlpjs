import { ActivityTypes, Middleware, TurnContext } from 'botbuilder';
import { NlpjsEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class Classification implements Middleware {
  public readonly engine: NlpjsEngine;

  public constructor(engine: NlpjsEngine) {
    this.engine = engine;
  }

  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    if (context.activity.type === ActivityTypes.Message) {
      const input = context.activity.text;
      try {
        const result = await this.engine.classifications(input);
        context.turnState.set('classifications', result);
      } catch (e) {
        throw new Error(`Failed to process classification on ${context.activity.text}. Error: ${e}`);
      }
    }
    await next();
  }
}
