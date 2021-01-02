import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { NlpjsEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class SentimentAnalysis implements Middleware {
  public readonly engine: Engine;

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  public static async build(nluFilePath: string, options?: any): Promise<SentimentAnalysis> {
    const nlpjsEngine = await NlpjsEngine.build((options || {}).settings, nluFilePath);
    return new SentimentAnalysis(nlpjsEngine);
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
