import { Engine } from '@botbuildercommunity/middleware-engine-core';
/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */
export declare class NlpjsEngine extends Engine {
    private readonly _nlu;
    private constructor();
    static build(settings: any, modelPath: string): Promise<NlpjsEngine>;
    private recognize;
    categories(input: any, config?: any): Promise<any>;
    concepts(input: any, config?: any): Promise<any>;
    detectLanguage(input: any, config?: any): Promise<string | undefined>;
    emotion(input: any, config?: any): Promise<any>;
    entities(input: any, config?: any): Promise<any>;
    keyPhrases(input: any, config?: any): Promise<any>;
    sentiment(input: any, config?: any): Promise<any | undefined>;
}
