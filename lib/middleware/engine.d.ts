import { Engine } from '@botbuildercommunity/middleware-engine-core';
/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */
export declare class NlpjsEngine extends Engine {
    private _settings;
    private _nlu;
    constructor(settings: any);
    static WithNluModel(modelPath: string): Promise<(n: any) => Promise<void>>;
    private recognize;
    categories(input: any, config?: any): Promise<any>;
    concepts(input: any, config?: any): Promise<any>;
    detectLanguage(input: any, config?: any): Promise<any>;
    emotion(input: any, config?: any): Promise<any>;
    entities(input: any, config?: any): Promise<any>;
    keyPhrases(input: any, config?: any): Promise<any>;
    sentiment(input: any, config?: any): Promise<any>;
}
