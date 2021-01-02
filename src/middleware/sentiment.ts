import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { NlpjsEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class SentimentAnalysis implements Middleware {
  public readonly engine: NlpjsEngine;

  public constructor(engine: NlpjsEngine) {
    this.engine = engine;
  }

  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    if (context.activity.type === ActivityTypes.Message) {
      const input = context.activity.text;
      try {
        const result = await this.engine.sentiment(input);
        const s = result.score;
        context.turnState.set('sentimentScore', s);
      } catch (e) {
        throw new Error(`Failed to process sentiment on ${context.activity.text}. Error: ${e}`);
      }
    }
    await next();
  }
}
