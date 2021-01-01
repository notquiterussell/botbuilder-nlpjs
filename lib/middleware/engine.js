"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpjsEngine = void 0;
const middleware_engine_core_1 = require("@botbuildercommunity/middleware-engine-core");
const node_nlp_1 = require("node-nlp");
/**
 * @module middleware-test/middleware/middleware-nlpjs-nlu
 */
class NlpjsEngine extends middleware_engine_core_1.Engine {
    constructor(nlu) {
        super();
        this._nlu = nlu;
    }
    static build(settings, modelPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const nlu = new node_nlp_1.NlpManager(settings);
            yield nlu.load(modelPath);
            return new NlpjsEngine(nlu);
        });
    }
    recognize(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._nlu.process(text);
        });
    }
    categories(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    concepts(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    detectLanguage(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.recognize(input);
            if (result && result.localeIso2) {
                return Promise.resolve(result.localeIso2);
            }
            return Promise.resolve(undefined);
        });
    }
    emotion(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    entities(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    keyPhrases(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    sentiment(input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.recognize(input);
            if (result) {
                return Promise.resolve(result.sentiment);
            }
            return Promise.resolve(undefined);
        });
    }
}
exports.NlpjsEngine = NlpjsEngine;
//# sourceMappingURL=engine.js.map