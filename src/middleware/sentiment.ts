import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { NlpjsEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class SentimentAnalysis implements Middleware {
  public engine: Engine;

  public async build(nluFilePath: string, options?: any) {
    this.engine = await NlpjsEngine.build((options || {}).settings, nluFilePath);
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
