import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { NlpjsEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class Answer implements Middleware {
  public readonly engine: NlpjsEngine;

  public constructor(engine: NlpjsEngine) {
    this.engine = engine;
  }

  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    if (context.activity.type === ActivityTypes.Message) {
      const input = context.activity.text;
      try {
        const result = await this.engine.answer(input);
        context.turnState.set('answer', result);
      } catch (e) {
        throw new Error(`Failed to process answer on ${context.activity.text}. Error: ${e}`);
      }
    }
    await next();
  }
}
